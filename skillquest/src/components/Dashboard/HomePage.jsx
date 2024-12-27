import React from 'react';
import './styles/HomePage.css';
import aptitudeLogo from './images/aptitude.png';
import codingLogo from './images/coding.png';
import trophyLogo from './images/trophyLogo.jpg';
import communityLogo from './images/community.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigationItems = [
    {
      icon: "fa-solid fa-terminal",
      title: 'Aptitude Tests',
      description: 'Practice quantitative, logical, and verbal reasoning',
      link: '/dashboard/aptitude', // Adjust path here
    },
    {
      icon: "fa-solid fa-clipboard-list",
      title: 'Coding Challenges',
      description: 'Enhance problem-solving skills with hands-on coding',
      link: '/dashboard/coding', // Adjust path here
    },
  ];

  const whyUsItems = [
    {
      logo: "fa-solid fa-chart-simple",
      heading: 'Comprehensive Practice',
      subHead: 'Cover all aspects of technical interviews',
    },
    {
      logo: "fa-solid fa-clipboard-question",
      heading: 'Industry Standard',
      subHead: 'Questions based on real interview experiences',
    },
  ];

  return (
    <div className='home'>
      <div className='intro'>
        <Link to="/login" className='h1-no-underline'>
          <h1>Master Your Interview Preparation</h1>
        </Link>
      </div>

      <div className='navigate'>
        {navigationItems.map((item, index) => (
          <Link key={index} to={item.link} className='no-underline'>
            <button className='item'>
              <div className='icon'>
                {/* <img src={item.icon} alt={item.title} /> */}
                <i className={item.icon} ></i>
              </div>
              <div className='msg'>
                <div>{item.title}</div>
                <p>{item.description}</p>
              </div>
            </button>
          </Link>
        ))}
      </div>

      <div className='why-us'>
        <div className='question'>Why Choose Us?</div>
        <div className='answer'>
          {whyUsItems.map((item, index) => (
            <div key={index} className='why-us-item'>
              <div className='logo'>
                <i className={item.logo}></i>  {/* Corrected here */}
              </div>
              <div className='explanation'>
                <div className='headingHome'>{item.heading}</div>
                <div className='sub-head'>{item.subHead}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Home;
