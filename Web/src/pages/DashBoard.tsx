/*
    this component will serve as the main dashboard page
    we do not write code directly here, instead we will create sub-components
    for different sections of the dashboard and import them here.
  */

import Card from "../components/Card";

const DashBoard = () => {
  return (
    <>
      <Card
        title="DashBoard"
        className="flex justify-center flex-col items-center"
      >
        <Card title="">
          <button className="btn btn-primary">
            This section will soon include data according to user Role
          </button>
        </Card>
      </Card>
    </>
  );
};

export default DashBoard;
