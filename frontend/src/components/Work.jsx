import React from "react";
import ChooseMeals from "../Assets/choose-image.png";
import CostSavings from "../Assets/costsavings.png";
import improvedHealthcare from "../Assets/improvedHealthcare.png"

const Work = () => {
  const workInfoData = [
    {
      image: improvedHealthcare,
      title: "Improved Healthcare Management",
      text: "By implementing a clinical decision support system and disease risk prediction tool, Saanjh can enhance its healthcare management capabilities.",
    },
    {
      image: ChooseMeals,
      title: "Enhanced Quality of Care",
      text: "The application enables healthcare professionals at Saanjh to make informed decisions based on evidence-based recommendations and predictive analytics.",
    },
    {
      image: CostSavings,
      title: "Cost Savings",
      text: "Early detection and prevention of diseases can lead to cost savings for Saanjh by reducing the need for expensive treatments or hospitalizations.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Work</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
          Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
          elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title} >
            <div className="info-boxes-img-container" style={{ width: '10rem', height: '10rem' }}>
              <img src={data.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
