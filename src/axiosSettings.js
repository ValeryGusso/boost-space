import ax from 'axios'

const axios = () => {
	const token = localStorage.getItem('token')
	const http = process.env.REACT_APP_API_URL.replace('https', 'http')
	return ax.create({
		baseURL: http,
		headers: { authorization: token },
	})
}

export default axios
