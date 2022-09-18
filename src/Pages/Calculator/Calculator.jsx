import { useDispatch, useSelector } from 'react-redux'
import cls from './Calculator.module.css'
import { ru } from 'date-fns/locale'
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import arrow from '../../assets/img/arrow.svg'
import Row from '../../Components/Row/Row'
import Loader from '../../Components/Loader/Loader'
import axios from '../../axiosSettings'
import { fetchPeriods } from '../../Redux/slices/periods'
import classNames from 'classnames'
import Confirm from '../../Components/Confirm/Confirm'

const confirmText = 'Ты действительно уверен, что хочешь создать период? Это действие невозможно отменить.'

const Calculator = () => {
	const dispatch = useDispatch()
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [tax, setTax] = useState({ usd: 0, rub: 0 })
	const [overall, setOverall] = useState({ usd: 0, rub: 0 })
	const [overallPayment, setOverallPayment] = useState({ usd: 0, rub: 0 })
	const [renderList, setRenderList] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const users = useSelector(state => state.users.users)
	const { data: periods } = useSelector(state => state.periods)
	const [selectedPeriod, setSelectedPeriod] = useState()
	const [text, setText] = useState('Выбор периода')
	const [showList, setShowList] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const confirmProps = useRef()
	const successParams = useRef()

	async function calculate(start, end, type) {
		const { data: res } = await axios().post('/orders/period', { startDate: start, endDate: end })
		const orders = type === 'period' ? res.currentPeriod : res.orders

		setSelectedPeriod(orders)
		setIsLoaded(true)

		const data = []
		let overallUSD = 0
		let overallRUB = 0
		let overallTaxUSD = 0
		let overallTaxRUB = 0
		let overallPaymentUSD = 0
		let overallPaymentRUB = 0

		users.map(el => data.push({ name: el.name, id: el.id, proceedsUSD: 0, proceedsRUB: 0 }))

		data.map(user => {
			orders.map(order => {
				order.group.map(player => {
					if (user.id === player._id && order.currency === 'usd') {
						user.proceedsUSD += (order.price - order.price * (order.tax / 100)) / order.group.length
						overallPaymentUSD += (order.price - order.price * (order.tax / 100)) / order.group.length
					}
					if (user.id === player._id && order.currency === 'rub') {
						user.proceedsRUB += (order.price - order.price * (order.tax / 100)) / order.group.length
						overallPaymentRUB += (order.price - order.price * (order.tax / 100)) / order.group.length
					}
				})
			})
		})

		orders.map(order => {
			order.currency === 'usd'
				? (overallTaxUSD += order.price * (order.tax / 100))
				: (overallTaxRUB += order.price * (order.tax / 100))
			order.currency === 'usd' ? (overallUSD += order.price) : (overallRUB += order.price)
		})

		data.sort((a, b) => (a.group < b.group ? -1 : 1))
		setRenderList(data)
		setTax({ usd: overallTaxUSD, rub: overallTaxRUB })
		setOverall({ usd: overallUSD, rub: overallRUB })
		setOverallPayment({ usd: overallPaymentUSD, rub: overallPaymentRUB })
	}

	function calcAll() {
		calculate()
		setStartDate()
		setEndDate()
		setText('За всё время')
		togle()
	}

	function setPeriod(start, end, text) {
		setStartDate(new Date(start))
		setEndDate(new Date(end))
		setText(text)
		calculate(start, end, 'period')
		togle()
	}

	function togle() {
		setShowList(!showList)
	}

	useEffect(() => {
		if (startDate && endDate) {
			setIsLoaded(false)
			calculate(startDate, endDate, 'period')
			setText(`${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`)
		} else {
			setText('Выбор периода')
		}

		if (!startDate && !endDate && renderList.length !== 0) {
			setText('За всё время')
		}

		setShowSuccess(false)
	}, [startDate, endDate])

	async function save() {
		const reqData = []
		const reqOrders = []

		renderList.map(el => {
			reqData.push({ user: el.id, proceedsUSD: el.proceedsUSD, proceedsRUB: el.proceedsRUB, paid: false })
		})

		selectedPeriod.map(el => {
			reqOrders.push(el._id)
		})

		const req = {
			start: startDate,
			end: endDate,
			data: reqData,
			tax: { valueUSD: tax.usd, valueRUB: tax.rub },
			orders: {
				items: reqOrders,
				summUSD: overall.usd,
				summRUB: overall.rub,
			},
		}

		const cbYes = async request => {
			const data = await axios()
				.post('/period', request)
				.catch(err => {
					if (err) {
						setShowSuccess(true)
						successParams.current = { collor: '#EF3B36', text: 'Ошибка' }
					}
				})

			if (data) {
				setShowSuccess(true)
				successParams.current = { collor: '#348f50', text: 'Период успешно создан' }
			}
		}

		confirmProps.current = {
			text: confirmText,
			children: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
			callbackNo: () => setShowConfirm(false),
			callbackYes: (param) => cbYes(param),
			request: req
		}

		// cbYes(req)
		setShowConfirm(true)
	}

	useEffect(() => {
		dispatch(fetchPeriods())
	}, [])

	return (
		<div className={cls.wrapper}>
			<div className={cls.period}>
				<div className={cls.header}>
					<DateRangePicker
						startDate={startDate}
						endDate={endDate}
						onStartDateChange={setStartDate}
						onEndDateChange={setEndDate}
						minimumLength={1}
						format="dd MM yyyy"
						locale={ru}
					>
						{({ startDateInputProps, endDateInputProps, focus }) => (
							<div className={cls.date_range}>
								<input
									className={focus === START_DATE ? cls.focus : ''}
									{...startDateInputProps}
									placeholder="Начало периода"
								/>
								<img src={arrow} alt="arrow" />
								<input className={focus === END_DATE ? cls.focus : ''} {...endDateInputProps} placeholder="Конец" />
							</div>
						)}
					</DateRangePicker>
					<div className={cls.select}>
						<button onClick={togle}>{text}</button>
						{showList && (
							<ul>
								<li onClick={calcAll}>За всё время</li>
								{periods.map(el => {
									return (
										<li
											key={el._id}
											onClick={() =>
												setPeriod(
													el.start,
													el.end,
													`${new Date(el.start).toLocaleDateString()} - ${new Date(el.end).toLocaleDateString()}`
												)
											}
										>
											{new Date(el.start).toLocaleDateString()} - {new Date(el.end).toLocaleDateString()}
										</li>
									)
								})}
							</ul>
						)}
					</div>
				</div>
				<div className={cls.orders}>
					{isLoaded ? (
						selectedPeriod.map(el => (
							<div key={el._id + 'sfsdf'} className={cls.content}>
								<div key={el._id + 'dffffax'} className={cls.row}>
									<Row
										key={el._id}
										date={el.date}
										type={el.type}
										group={el.group}
										price={el.price}
										tax={el.tax}
										currency={el.currency}
										description={el.description}
										orderLink={el.orderLink}
										priceLink={el.priceLink}
									/>
								</div>
							</div>
						))
					) : (
						<div className={cls.loader}>{startDate && endDate && <Loader />}</div>
					)}
				</div>
			</div>
			<div className={cls.info}>
				<ul>
					{renderList.map(el => (
						<li key={el.id}>
							<div>{el.name}</div> <div>{el.proceedsUSD.toFixed(2)}$</div> <div>{el.proceedsRUB.toFixed(2)}₽</div>
						</li>
					))}
					<li>
						<div>Орг. сбор</div>
						<div>{tax.usd.toFixed(2)} $</div>
						<div>{tax.rub.toFixed(2)} P</div>
					</li>
					<li>
						<div>Общая сумма заказов: {overall.usd.toFixed(2)} $</div>
						<div>Общая сумма выплат: {(overallPayment.usd + tax.usd).toFixed(2)} $</div>
					</li>
					<li>
						<div>Общая сумма заказов: {overall.rub.toFixed(2)} P</div>
						<div>Общая сумма выплат: {(overallPayment.rub + tax.rub).toFixed(2)} ₽</div>
					</li>
				</ul>
				<button onClick={save} disabled={renderList.length === 0 || showSuccess}>
					{' '}
					Сохранить период
				</button>
				{showSuccess && (
					<p
						className={classNames(cls.success, showSuccess ? cls.successShow : '')}
						style={{ '--color': successParams.current?.collor }}
					>
						{successParams.current?.text}
					</p>
				)}
				{showConfirm && (
					<Confirm
						type="period"
						text={confirmProps.current?.text}
						children={confirmProps.current?.children}
						callbackNo={confirmProps.current?.callbackNo}
						callbackYes={confirmProps.current?.callbackYes}
						request={confirmProps.current.request}
					/>
				)}
			</div>
		</div>
	)
}

export default Calculator
