import React from 'react';
import LayoutMain from '../../components/layoutMain';
import './assets/style.scss';

import Carousel from './Carousel'
import ComboList from './ComboList'
import StandList from './StandList'
import CaseList from './CaseList'

const Home = () => (
    <LayoutMain>
        <Carousel />
        <ComboList />
        <StandList />
        <CaseList />
    </LayoutMain>
)

export default Home