/*
    this component will serve as the main dashboard page
    we do not write code directly here, instead we will create sub-components
    for different sections of the dashboard and import them here.
  */
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { getPatients } from "../api/getPatients";
const DashBoard = () => {
  return (
    <>
      <NavBar />
      <Card
        title="DashBoard"
        className="flex justify-center flex-col items-center"
      >
        <Card title="get Patient API test button">
          <button className="btn btn-primary" onClick={getPatients}>
            Click Here to test getPatients API (check console for results)
          </button>
        </Card>
      </Card>

      <Footer />
    </>
  );
};

export default DashBoard;
