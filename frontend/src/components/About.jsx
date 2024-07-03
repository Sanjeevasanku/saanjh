import React from "react";
import AboutBackground from "../Assets/about-background.png";
import AboutBackgroundImage from "../Assets/about-background-image.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">About</p>
        <h1 className="primary-heading">
          Overview:
        </h1>
        <p className="primary-text">

          
          At Saanjh, we offer a range of personalized services tailored to meet the unique needs of each individual:
          <ul>
          <li>Health Monitoring: Regular health assessments and record-keeping to track the well-being of our residents.</li>
          <li>Disease Risk Prediction: Utilizing advanced technology to predict and mitigate the risk of common age-related diseases.</li>
          <li>Personalized Care Plans: Customized care plans designed to promote physical, emotional, and cognitive health.</li>
          </ul>
        </p>
        <div className="about-buttons-container">
          <button className="secondary-button">Learn More</button>
          <a href="https://youtu.be/XcUYE4m6hNE?si=p4FqjUSV5wBrrFCO">
            <button className="watch-video-button">
              <BsFillPlayCircleFill /> Watch Video
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
