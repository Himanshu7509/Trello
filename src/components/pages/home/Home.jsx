import React from 'react'
import TestimonialSlider from './Home-component/TestimonialSlider'
import HeroSection from './Home-component/HeroSection'
import ProductivityPowerhouse from './Home-component/Productivity'
import MessageToAction from './Home-component/Message'
import DoMoreWithTrello from './Home-component/DoMore'
import TrelloFooterSection from './Home-component/Footer'
import HomeHeader from './Home-component/HomeHeader'

const Home = () => {
  return (
    <div>
        <HomeHeader/>
        <HeroSection/>
        <ProductivityPowerhouse/>
        <MessageToAction/>
        <DoMoreWithTrello/>
        <TestimonialSlider/>
        <TrelloFooterSection/>
    </div>
  )
}

export default Home