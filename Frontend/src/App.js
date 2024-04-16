import './App.css';
import Header from './components/Header/Header';
import LineChart from './components/LineChart/LineChart';
import MDSPlot from './components/MDSPlot/MDSPlot';
import MDSPlot2 from './components/MDSPlot2/MDSPlot2';
import PCPPlot from './components/PCPPlot/PCPPlot';
import PCPPlot2 from './components/PCPPlot2/PCPPlot2';
import MainPage from './pages/MainPage/MainPage';
import DashBoard from './pages/DashBoard/DashBoard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import axios from 'axios';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
	

	const [k, setK] = useState(5);

	useEffect(() => {

		axios.get('http://localhost:2000/best_k').then((repos) => {
		  const getData = repos.data;
		  setK(getData)


		});
}, []);

	return (
		<Router>
			<Header  />
			
			<div className="article">
				<Routes>
					<Route path="/" element={<DashBoard k={k} setK={setK} />} />
				
					<Route
						path="/MDSPlot"
						element={<MDSPlot k={k} />}
					/>

					<Route
						path="/MDSPlot2"
						element={<MDSPlot2  />}
					/>

					<Route
						path="/PCPPlot"
						element={<PCPPlot k={k} />}
					/>

					<Route
						path="/PCPPlot2"
						element={<PCPPlot2 k={k} />}
					/>

					<Route
						path="/MSEPlot"
						element={<LineChart  k = {k} setK = {setK}/>}
					/>

				</Routes>
			</div>
		</Router>
	);
}

export default App;
