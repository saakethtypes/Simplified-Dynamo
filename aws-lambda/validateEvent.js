module.exports = async (data, paramConditions, callback) => {
	let isValid = false;
	let broken = false;
	let paramConditionsKeys = Object.keys(paramConditions);
	paramConditionsKeys.forEach((key) => {
		if (key in data) {
			if (paramConditions[key][0] == "L") {
				if (data[key].length >= paramConditions[key][1]) {
					isValid = true;
				} else {
					broken = true;
				}
			} else if (paramConditions[key][0] == "N") {
				if (data[key] >= paramConditions[key][1]) {
					isValid = true;
				} else {
					broken = true;
				}
			} else if (paramConditions[key][0] == "S") {
				if (data[key].length >= paramConditions[key][1]) {
					isValid = true;
				} else {
					broken = true;
				}
			} else if (paramConditions[key][0] == "B") {
				if (data[key] == true || data[key] == false ) {
					isValid = true;
				} else {
					broken = true;
				}
			}
		} else {
			if (paramConditions[key][2]) {
				broken = true;
			}
		}
	});

	if (broken) {
		return !broken;
	}
	return !broken;
};
