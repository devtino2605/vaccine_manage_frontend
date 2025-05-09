import { BounceLoader } from "react-spinners";

const Loading = () => (
  
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Chiếm toàn bộ chiều cao màn hình
    }}
  >
    <BounceLoader color="#12997f" loading size={50} />
  </div>
);

export default Loading;