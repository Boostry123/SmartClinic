/*
    this component will serve as the main dashboard page
    we do not write code directly here, instead we will create sub-components
    for different sections of the dashboard and import them here.
  */
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CardComponent from "../components/Card";
const DashBoard = () => {
  return (
    <>
      <NavBar />
      <CardComponent
        title="DashBoard"
        className="flex justify-center flex-col items-center"
      >
        <CardComponent title="Inner Card Title">inner Card Title</CardComponent>
      </CardComponent>

      <Footer />
    </>
  );
};

export default DashBoard;
