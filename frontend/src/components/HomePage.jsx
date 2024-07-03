import React from 'react'; 
import Home from "./Home.jsx";
import About from "./About.jsx";
import Work from "./Work.jsx";
import Testimonial from "./Testimonial.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";

const HomePage = () => {
  return (
    <div>
      <Home />
      <About />
      <Work />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  )
}

export default HomePage
