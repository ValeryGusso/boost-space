import ax from 'axios'

const axios = () => {
	const token = localStorage.getItem('token')
	return ax.create({
		baseURL: 'http://localhost:666',
		headers: { authorization: token },
	})
}

export default axios
