import React from "react";
import "./MainPage.css";
import profileWHL from "../../images/profileWHL.jpg";
const MainPage = () => {

  return (
    <>
      <main className="main">
        <div className="title">About New York Housing Data by Air bnb </div>
        <div >
   
            <p>The application described is a ReactJS-based visualization tool designed for analyzing and presenting data from the New York Airbnb dataset. Leveraging the d3 library, it enables users to explore various aspects of Airbnb listings in New York through interactive charts, such as bar charts, histograms, and scatter plots.</p>
            <p>The app focuses on a curated selection of 18 attributes from the dataset, encompassing both numerical and categorical variables like price, property type, and host location, to provide insights into the dynamics behind listing prices and guest preferences. Users can customize visualizations by selecting different dataset attributes for comparison, thereby gaining a deeper understanding of the factors influencing Airbnb listings in New York.</p>
            <p>This tool is aimed at offering a comprehensive analysis platform for those interested in travel, accommodation trends, and the specifics of the New York housing market through Airbnb's lens.</p>
      

        </div>


        <div className="title2">Developer </div>

        <div className="row">
          <div className="column">
            <div className="card">
              <img src={profileWHL} alt="Woohyung Lee" />
              <div className="container">
                <h4>Woohyung Lee</h4>
                <p className="title">Developer</p>
                <p className="profile-text">
                  Hello, I am Woohyung Lee, a Senior majoring in CS computer
                  science
                </p>
                <a href="https://github.com/TREEANA">
                  <p>
                    <button className="github-button">Github</button>
                  </p>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default MainPage;
