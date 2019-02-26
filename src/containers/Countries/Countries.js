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

	// выводим список стран при загрузке страницы
	componentDidMount () {
		// объявлем в качестве констант разные части URL-ов 
		// для составления API-адресов для получения данных
		const baseURL = 'https://restcountries.eu/rest/v2/';
		const countriesURL = 'all?fields=name;alpha3Code';
		const alphaURL = 'alpha/';

		// строим axios-запрос для вывода данных: 
		// получаем список всех стран с alpha3-кодами,
		// проходим по каждой стране из списка с помощью "map" (по alpha3-коду)
		// и возвращаем информацию: код и название страны
		// чтобы все страны успели подгрузиться, используем Promise.all,
		// который сохраняет данные только после того, как все запросы пройдут
		axios.get(baseURL + countriesURL).then(response => {
			const requests = response.data.map(country => {
				return axios.get(baseURL + alphaURL + country.alpha3Code).then(response => {
					return {...country};
				});
			});
			return Promise.all(requests);
		}).then(countries =>
			this.setState({countries})
		).catch(error => {
			console.log(error, 'error');
		});
		console.log(this.state.countries, 'didMount')
	}

	// передаем в стейт alpha3-код страны, по которой кликнул пользователь
	countrySelected = (alpha) => {
		this.setState({
			...this.state,
			selectedCountryAlpha: alpha
		});
		console.log(this.state.selectedCountryAlpha, 'countrySelected')
	}	

	render () {

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
					<CountryInfo
						alpha={this.state.selectedCountryAlpha}
					/>
					</section>
				</div>
			</Fragment>	
		);
	}
}

export default Countries;