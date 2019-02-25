import React, {Component} from 'react';
import axios from 'axios';


class CountryInfo extends Component {
	state = {
		loadedCountry: null
	};

	componentDidUpdate() {
		const loadedCountry = this.state.loadedCountry;
		const newAlpha = this.props.alpha;
		const baseURL = 'https://restcountries.eu/rest/v2/';
		const alphaURL = 'alpha/';


		if (newAlpha) {
			if (!loadedCountry || newAlpha !== loadedCountry.alpha3Code) {
				axios.get(baseURL + alphaURL + this.props.alpha).then(response => {
					this.setState({loadedCountry: response.data});
				});
			}
		}
	}

	render() {
		return (
			this.state.loadedCountry ? <div className="CountryInfo">
				<h1>{this.state.loadedCountry.name}</h1>
				<p>{this.state.loadedCountry.capital}</p>
				<p>{this.state.loadedCountry.population}</p>
			</div> : null
		);
	}
}

export default CountryInfo;



