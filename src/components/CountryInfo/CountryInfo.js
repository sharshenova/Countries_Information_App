import React, {Component} from 'react';
import axios from 'axios';


class CountryInfo extends Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.state.loadedCountry = null;
		this.state.borderNames = []
	}

	// выводим информацию о стране при получении нового alpha3-кода
	// находим поле borders, содержащее alpha3-коды пограничных стран
	// по каждому из этих кодов делаем запрос на получение данных об этой стране,
	// оттуда возвращаем имя каждой пограничной страны.
	// чтобы все имена пограничных стран успели подгрузиться, используем Promise.all
	// возвращаем response.data (данные о нужной стране) из внешнего запроса response
	// и [...border] - имена пограничных стран из requests
	componentDidUpdate() {
		const loadedCountry = this.state.loadedCountry;
		const newAlpha = this.props.alpha;
		const baseURL = 'https://restcountries.eu/rest/v2/';
		const alphaURL = 'alpha/';

		if (newAlpha) {
			if (!loadedCountry || newAlpha !== loadedCountry.alpha3Code) {
				axios.get(baseURL + alphaURL + newAlpha).then(response => {

					const requests = response.data.borders.map(border => {
						return axios.get(baseURL + alphaURL + border).then(response => {
							return response.data.name
						});
					});
					
					console.log(requests, 'requests')
					
					return Promise.all(requests).then(border =>
					this.setState({
						loadedCountry: response.data,
						borderNames: [...border]
					}))
				}).catch(error => {
					console.log(error, 'error')
				});
			}
		}
		console.log(this.state, 'didUpdate')
	}

	render() {

		return (
			this.state.loadedCountry ? <div className="CountryInfo">
				<h2>Информация о стране</h2>
				<h3>{this.state.loadedCountry.name}</h3>
				<p><b>Capital:</b> {this.state.loadedCountry.capital}</p>
				<p><b>Population:</b> {this.state.loadedCountry.population}</p>
				<p><b>Пограниченые страны:</b></p>

				<div>
					{this.state.borderNames.map(borderName => (
						<p key={borderName}>{borderName}</p>
					))}
				</div>
			</div> : <div>Выберите страну</div>
		);
	}
}

export default CountryInfo;


