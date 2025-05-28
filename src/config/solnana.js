import { Connection, PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor/dist/browser';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import bs58 from 'bs58';
import env from './env';

// Solana Devnet connection
const connection = new Connection(env.RPC_URL, 'confirmed');

// Load program's keypair
const programKeypair = Keypair.fromSecretKey(new Uint8Array(env.SECRET_KEY));

// Phantom wallet adapter
const wallet = new PhantomWalletAdapter();

// Load Anchor program
const programId = new PublicKey(env.PROGRAM_ID);

// Initialize provider and program
let provider;
let program;

// Helper function to convert string to Uint8Array
const stringToUint8Array = (str) => {
    return new TextEncoder().encode(str);
};

// Initialize the program
const initializeProgram = async () => {
    try {
        // Import IDL file
        const idl = await import('D:\\SELT_LEARN\\Rust\\solana-project\\my_solana_project\\target\\idl\\my_solana_project.json');
        
        // Create provider
        provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
        
        // Create program
        program = new Program(idl.default, provider);
        console.log('Program initialized successfully:', program);
        return program;
    } catch (error) {
        console.error('Failed to initialize program:', error);
        throw error;
    }
};

class SolanaClient {
    constructor() {
        this.initialized = false;
    }

    async ensureInitialized() {
        if (!this.initialized) {
            await initializeProgram();
            this.initialized = true;
        }
    }

    async initializeCounter() {
        try {
            await this.ensureInitialized();
            if (!wallet.connected) {
                await wallet.connect();
            }
            const [counterPda] = PublicKey.findProgramAddressSync(
                [stringToUint8Array('counter')],
                programId
            );
            const accountInfo = await connection.getAccountInfo(counterPda);
            if (accountInfo && accountInfo.data.length > 0) {
                console.log("Counter account already exists:", counterPda.toString());
                const counter = await program.account.counter.fetch(counterPda);
                console.log("Current appointment count:", counter.appointmentCount.toNumber());
                return { success: true, tx_signature: null };
            }
            const tx = await program.methods
                .initializeCounter()
                .accounts({
                    counter: counterPda,
                    authority: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .signers([])
                .rpc();
            console.log('Counter initialized, transaction signature:', tx);
            return { success: true, tx_signature: tx };
        } catch (error) {
            console.error('Error in initializeCounter:', error);
            throw new Error(`Failed to initialize counter: ${error.message}`);
        }
    }

    async initializeVaccinationRecord({ patient_id, vaccine_id, appointment_date, center_id }) {
        try {
            await this.ensureInitialized();
            if (!wallet.connected) {
                await wallet.connect();
            }
            console.log(wallet.publicKey);
            const [counterPda] = PublicKey.findProgramAddressSync(
                [stringToUint8Array('counter')],
                programId
            );
            const accountInfo = await connection.getAccountInfo(counterPda);
            if (!accountInfo || accountInfo.data.length === 0) {
                throw new Error('Counter account does not exist. Please call initializeCounter first.');
            }
            const counter = await program.account.counter.fetch(counterPda);
            const appointmentCount = counter.appointmentCount.toNumber();
            const [vaccinationPda] = PublicKey.findProgramAddressSync(
                [
                    stringToUint8Array('vaccination'),
                    wallet.publicKey.toBuffer(),
                    new BN(appointmentCount).toArrayLike(Buffer, 'le', 8), // Chuyển thành byte array
                ],
                programId
            );
            if (appointment_date.length > 60) {
                throw new Error('Cannot exceed 60 characters');
            }
            if (patient_id === 0 || vaccine_id === 0 || center_id === 0) {
                throw new Error('Invalid ID');
            }
            const tx = await program.methods
                .createVaccinationRecord(
                    new BN(patient_id),
                    new BN(vaccine_id),
                    appointment_date,
                    new BN(center_id)
                )
                .accounts({
                    vaccinationRecord: vaccinationPda,
                    counter: counterPda,
                    authority: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .signers([])
                .rpc();
            const record = await program.account.vaccinationRecord.fetch(vaccinationPda);
            return { 
                success: true, 
                tx_signature: tx,
                record: {
                    appointment_id: record.appointmentId,
                    patient_id: record.patientId.toNumber(),
                    vaccine_id: record.vaccineId.toNumber(),
                    appointment_date: record.appointmentDate,
                    center_id: record.centerId.toNumber(),
                    authority: record.authority.toString(),
                    status: record.status,
                    doctor_id: record.doctorId ? record.doctorId.toNumber() : null,
                    created_at: record.createdAt.toNumber(),
                    updated_at: record.updatedAt.toNumber(),
                }
            };
        } catch (error) {
            console.error('Error in initializeVaccinationRecord:', error);
            throw new Error(`Failed to create vaccination record: ${error.message}`);
        }
    }

    async getVaccinationRecords(patientId) {
        try {
            await this.ensureInitialized();
            // Fetch all VaccinationRecord accounts
            const accounts = await program.account.vaccinationRecord.all([
                {
                    memcmp: {
                        offset: 8 + 32, // Offset: discriminator (8) + appointment_id (32)
                        bytes: bs58.encode(new BN(patientId).toBuffer('le', 8)), // Use base58 encoding
                    },
                },
            ]);
            console.log(accounts);
            // Map the accounts to a more user-friendly format
            const records = accounts.map(account => ({
                appointment_id: account.account.appointmentId,
                patient_id: account.account.patientId.toNumber(),
                vaccine_id: account.account.vaccineId.toNumber(),
                appointment_date: account.account.appointmentDate,
                center_id: account.account.centerId.toNumber(),
                authority: account.account.authority.toString(),
                status: account.account.status,
                doctor_id: account.account.doctorId ? account.account.doctorId.toNumber() : null,
                created_at: account.account.createdAt.toNumber(),
                updated_at: account.account.updatedAt.toNumber(),
            }));
            return {
                success: true,
                records,
            };
        } catch (error) {
            console.error('Error in getAppointment:', error);
            throw new Error(`Failed to fetch appointments: ${error.message}`);
        }
    }

    
    async updateVaccinationStatus(appointmentId, newStatus) {
        try {
            await this.ensureInitialized();
            if (!wallet.connected) {
                await wallet.connect();
            }
            const [vaccinationPda] = PublicKey.findProgramAddressSync(
                [
                    stringToUint8Array('vaccination'),
                    wallet.publicKey.toBuffer(),
                    stringToUint8Array(appointmentId),
                ],
                programId
            );
            const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
            const statusKey = Object.keys(newStatus)[0];
            if (!validStatuses.includes(statusKey)) {
                throw new Error('Invalid status');
            }
            const tx = await program.methods
                .updateVaccinationStatus(newStatus)
                .accounts({
                    vaccinationRecord: vaccinationPda,
                    authority: wallet.publicKey,
                })
                .signers([])
                .rpc();
            return {
                success: true,
                tx_signature: tx
            };
        } catch (error) {
            console.error('Error in updateVaccinationStatus:', error);
            throw new Error(`Failed to update vaccination status: ${error.message}`);
        }
    }

    async updateDoctorId(appointmentId, doctorId) {
        try {
            await this.ensureInitialized();
            if (!wallet.connected) {
                await wallet.connect();
            }
            const [vaccinationPda] = PublicKey.findProgramAddressSync(
                [
                    stringToUint8Array('vaccination'),
                    wallet.publicKey.toBuffer(),
                    stringToUint8Array(appointmentId),
                ],
                programId
            );
            if (doctorId === 0) {
                throw new Error('Invalid doctor ID');
            }
            const tx = await program.methods
                .updateDoctorId(new BN(doctorId))
                .accounts({
                    vaccinationRecord: vaccinationPda,
                    authority: wallet.publicKey,
                })
                .signers([])
                .rpc();
            return {
                success: true,
                tx_signature: tx
            };
        } catch (error) {
            console.error('Error in updateDoctorId:', error);
            throw new Error(`Failed to update doctor ID: ${error.message}`);
        }
    }
}

// Create and export a single instance
const solanaClient = new SolanaClient();
export default solanaClient;