import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from '../../axiosSettings'
import Loader from '../../Components/Loader/Loader'
import { fetchPeriods } from '../../Redux/slices/periods'
import cls from './Payment.module.css'

const Payment = () => {
	const dispatch = useDispatch()
	const isAdmin = useSelector(state => state.auth.isAdmin)
	const [selectedPeriod, setSelectedPeriod] = useState(0)
	const { data, isLoaded } = useSelector(state => state.periods)
	const [active, setActive] = useState(0)

	useEffect(() => {
		dispatch(fetchPeriods())
	}, [])

	function changePeriod(index) {
		setSelectedPeriod(index)
		setActive(index)
	}

	async function isPaid(id) {
		if (isAdmin) {
			const period = data[selectedPeriod]._id
			await axios().post('/ispaid', { id, period })
			dispatch(fetchPeriods())
		}
	}

	return (
		<div className={cls.wrapper}>
			<div className={cls.select}>
				<p>Выбери период: </p>
				<ul>
					{data.map((el, i) => {
						return (
							<li onClick={() => changePeriod(i)} key={el._id} className={active === i ? cls.active : ''}>
								{new Date(el.start).toLocaleDateString()} - {new Date(el.end).toLocaleDateString()}
							</li>
						)
					})}
				</ul>
			</div>
			<div className={cls.container}>
				<ul>
					{isLoaded ? (
						data[selectedPeriod].data.map(el => {
							return (
								<li className={el.paid ? cls.paid : ''} key={el._id}>
									<div className={isAdmin ? cls.isAdmin : ''}  onDoubleClick={() => isPaid(el.user._id)}>{el.user.name}</div>
									<div>{el.proceedsUSD.toFixed(2)} $</div>
									<div>{el.proceedsRUB.toFixed(2)} ₽</div>
								</li>
							)
						})
					) : (
						<div className={cls.loader}>
							<Loader />
						</div>
					)}
					{isLoaded && (
						<>
							<li>
								<div>Орг. сбор: </div> <div>{data[selectedPeriod].tax.valueUSD.toFixed(2)} $</div>
								<div>{data[1].tax.valueRUB.toFixed(2)} ₽</div>
							</li>
							<li>
								<div>Общая сумма выплат: </div> <div>{data[selectedPeriod].orders.summUSD.toFixed(2)} $</div>
								<div>{data[1].orders.summRUB.toFixed(2)} ₽</div>
							</li>
						</>
					)}
				</ul>
			</div>
		</div>
	)
}

export default Payment
