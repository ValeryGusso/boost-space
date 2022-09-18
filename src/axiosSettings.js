import ax from 'axios'

const axios = () => {
	const token = localStorage.getItem('token')
	return ax.create({
		baseURL: process.env.REACT_APP_API_URL || 'http://localhost:666',
		headers: { authorization: token },
	})
}

export default axios
