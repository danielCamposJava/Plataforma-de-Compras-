import React, { useState } from 'react'
import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import AppDonwload from '../../Components/AppDonwload/AppDonwload'
import BodyExplore from '../../Components/body/bodyexplore'

const Home = () => {

  const[category,setCategory] = useState('ALL');

  return (
    <div>
    <Header/>
    <ExploreMenu category={category} setCategory={setCategory}/>
    <BodyExplore/>
    <FoodDisplay category={category}/>
    <AppDonwload/>
    </div>
  )
}

export default Home