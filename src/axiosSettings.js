import ax from 'axios'

const axios = () => {
	const token = localStorage.getItem('token')
	return ax.create({
		baseURL: REACT_APP_API_URL,
		headers: { authorization: token },
	})
}

export default axios
