import React from 'react';

function Country (props) {
	return (
		<div className="Country">
			<div onClick={props.clicked}>{props.name}</div>
		</div>
	)
}

export default Country;