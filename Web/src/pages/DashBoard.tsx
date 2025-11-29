/*
    this component will serve as the main dashboard page
    we do not write code directly here, instead we will create sub-components
    for different sections of the dashboard and import them here.
  */
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Card from "../components/Card";
const DashBoard = () => {
  return (
    <>
      <NavBar />
      <Card
        title="DashBoard"
        className="flex justify-center flex-col items-center"
      >
        <Card title="Inner Card Title">inner Card Title</Card>
      </Card>

      <Footer />
    </>
  );
};

export default DashBoard;
