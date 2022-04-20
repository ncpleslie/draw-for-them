import DashboardBtn from "./components/UI/DashboardBtn";
import Icon from "./components/UI/Icon";

function App() {
  return (
    <div className="app-container h-[100vh] w-[100vw] flex flex-row justify-center items-center">
      <DashboardBtn className="h-[90vh] w-[50%] m-4" link="/draw">
        <>
          <Icon.Pen />
          Draw
        </>
      </DashboardBtn>
      <DashboardBtn className="h-[90vh] w-[50%] m-4" link="/view">
        <>
          <Icon.Image />
          View
        </>
      </DashboardBtn>
    </div>
  );
}

export default App;
