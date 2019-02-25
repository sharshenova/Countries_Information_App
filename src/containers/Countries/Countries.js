import React, { Component, Fragment } from 'react';
import Country from "../../components/Country/Country";
import axios from 'axios';


class Countries extends Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.state.countries = [];
	}

	componentDidMount () {
		let baseURL = 'https://restcountries.eu/rest/v2/';
		let countriesURL = 'all?fields=name;alpha3Code';
		let alphaURL = 'alpha/';
		axios.get(baseURL + countriesURL).then(response => {
			const requests = response.data.map(country => {
				return axios.get(baseURL + alphaURL + country.alpha3Code).then(response => {
					return {...country, borders: response.data.borders};
				});
			});
			return Promise.all(requests);
		}).then(countries =>
			this.setState({countries})
		).catch(error => {
			console.log(error);
		});
	}


	render () {



		return (
			<Fragment>
				<section className="Countries">
					{this.state.countries.map(country => (
						<Country key={country.alpha3Code} name={country.name}/>
					))}
				</section>
			</Fragment>
		
		);
	}
}

export default Countries;