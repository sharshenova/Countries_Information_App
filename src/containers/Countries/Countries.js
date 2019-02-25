import React, { Component, Fragment } from 'react';
import Country from "../../components/Country/Country";
import CountryInfo from "../../components/CountryInfo/CountryInfo";
import axios from 'axios';


class Countries extends Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.state.countries = [];
		this.state.selectedCountryAlpha = null
	}

	componentDidMount () {
		const baseURL = 'https://restcountries.eu/rest/v2/';
		const countriesURL = 'all?fields=name;alpha3Code';
		const alphaURL = 'alpha/';

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

	countrySelected = (alpha) => {
		this.setState({
			...this.state,
			selectedCountryAlpha: alpha
		});
		console.log(this.state.selectedCountryAlpha)
	}	

	render () {

		let instruction = null;

		if (!this.state.selectedCountryAlpha) {
			instruction = (
				<section className="Instruction">
					<p>Please choose the country</p>
				</section>
			);
		}

		let countryInfoBlock = null;

		if (this.state.selectedCountryAlpha) {
			countryInfoBlock = (
				<section className="CountryInfoBlock">
					<CountryInfo
						alpha={this.state.selectedCountryAlpha}
					/>
				</section>
			);
		}

		return (
			<Fragment>
				<div className="container row mt-60">
					<section className="CountryList col col-4 border border-dark rounded">
						{this.state.countries.map(country => (
							<Country
								key={country.alpha3Code}
								name={country.name}
								clicked={() => this.countrySelected(country.alpha3Code)}
							/>
						))}
					</section>
					<section className="CountryDetails col col-7 border border-dark rounded">		
						{instruction}
						{countryInfoBlock}
					</section>
				</div>
			</Fragment>	
		);
	}
}

export default Countries;