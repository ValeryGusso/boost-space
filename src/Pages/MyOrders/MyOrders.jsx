import Row from '../../Components/Row/Row'
import cls from './MyOrders.module.css'
import { useState } from 'react'
import { ru } from 'date-fns/locale'
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import './Calendar.css'
import arrow from '../../assets/img/arrow.svg'
import reset from '../../assets/img/reset.svg'
import { useEffect } from 'react'
import Loader from '../../Components/Loader/Loader'
import axios from '../../axiosSettings'
import classNames from 'classnames'

const types = [
	{ title: 'Все', key: '' },
	{ title: 'Типу', key: 'type' },
	{ title: 'Цене: дороже', key: 'priceDown' },
	{ title: 'Цене: дешевле', key: 'priceUp' },
	{ title: 'Моей доле: больше', key: 'partUp' },
	{ title: 'Моей доле: меньше', key: 'partDown' },
	{ title: 'Заметке', key: 'description' },
]

const MyOrders = () => {
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [search, setSearch] = useState('')
	const [sortType, setSortType] = useState(types[0])
	const [showSort, setShowSort] = useState(false)
	const [orders, setOrders] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [renderList, setRenderList] = useState([])
	const [usd, setUSD] = useState(0)
	const [rub, setRub] = useState(0)

	function sort(type) {
		switch (type) {
			case 'type':
				const typeMatch = []
				orders.map(el => {
					if (el.type.includes(search)) {
						typeMatch.push(el)
					}
				})
				setRenderList(typeMatch)
				calc(typeMatch)
				break
			case 'description':
				const descriptionMatch = []
				orders.map(el => {
					if (el.description.includes(search)) {
						descriptionMatch.push(el)
					}
				})
				setRenderList(descriptionMatch)
				calc(descriptionMatch)
				break
			case 'priceUp':
				const priceUp = []
				orders.map(el => {
					if (el.price < +search) {
						priceUp.push(el)
					}
				})
				setRenderList(priceUp)
				calc(priceUp)
				break
			case 'priceDown':
				const priceDown = []
				orders.map(el => {
					if (el.price > +search) {
						priceDown.push(el)
					}
				})
				setRenderList(priceDown)
				calc(priceDown)
				break
			case 'partUp':
				const partUp = []
				orders.map(el => {
					const part = (el.price - el.price * (el.tax / 100)) / el.group.length
					if (part > +search) {
						partUp.push(el)
					}
				})
				setRenderList(partUp)
				calc(partUp)
				break
			case 'partDown':
				const partDown = []
				orders.map(el => {
					const part = (el.price - el.price * (el.tax / 100)) / el.group.length
					if (part < +search) {
						partDown.push(el)
					}
				})
				setRenderList(partDown)
				calc(partDown)
				break
			default:
				setRenderList(orders)
				calc(orders)
		}
	}

	useEffect(() => {
		sort(sortType.key)
	}, [search])

	useEffect(() => {
		if (startDate && endDate) {
			setIsLoaded(false)
			overDate(startDate, endDate)
		}
	}, [startDate, endDate])

	useEffect(() => {
		overDate()
	}, [])

	function clereDates() {
		setStartDate(null)
		setEndDate(null)
		overDate()
		calc(orders)
	}

	function togleSort() {
		setShowSort(!showSort)
	}

	function setSort(index) {
		setSortType(types[index])
		sort(types[index].key)
		togleSort()
	}

	function searching(event) {
		setSearch(event.target.value)
	}

	async function overDate(start, end) {
		const { data: res } = await axios().post('/orders/period', { startDate: start, endDate: end })
		const response = start && end ? res.myCurrentPeriod : res.myOrders

		calc(response)
		setIsLoaded(true)
		setRenderList(response)
		setOrders(response)
	}

	function calc(array) {
		let summUSD = 0
		let summRUB = 0
		array.map(el => {
			if (el.currency === 'usd') {
				const part = (el.price - el.price * (el.tax / 100)) / el.group.length
				summUSD += part
			} else {
				const part = (el.price - el.price * (el.tax / 100)) / el.group.length
				summRUB += part
			}
		})

		setUSD(summUSD)
		setRub(summRUB)
	}

	return (
		<div className={cls.home}>
			<div className={cls.calendar}>
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
								className={classNames(cls.input_cal, focus === START_DATE ? cls.focus : '')}
								{...startDateInputProps}
								placeholder="Начало периода"
							/>
							<img src={arrow} alt="arrow" />
							<input
								className={classNames(cls.input_cal, focus === END_DATE ? cls.focus : '')}
								{...endDateInputProps}
								placeholder="Конец"
							/>
						</div>
					)}
				</DateRangePicker>
				<div className={cls.info}>
					<p>Всего заказов: {renderList.length}</p>
					<p>
						Всего заработанно: {usd.toFixed(2)}$ и {rub.toFixed(2)}₽
					</p>
				</div>
				{endDate && (
					<div className={cls.reset}>
						<p>Сбросить период</p>
						<img src={reset} alt="reset" onClick={clereDates} />
					</div>
				)}
			</div>
			<div className={cls.content}>
				{isLoaded && (
					<div className={cls.wrapper}>
						<div className={cls.search}>
							<div>Поиск по:</div>
							<div className={cls.sortTitle} onClick={togleSort}>
								{sortType.title}
							</div>
							<input type="text" disabled={!sortType.key} value={sortType.key ? search : ''} onChange={searching} />
							{showSort && (
								<div className={cls.searchList}>
									<ul>
										{types.map((el, i) => (
											<li key={el.key} onClick={() => setSort(i)}>
												{el.title}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
						<div className={cls.title}>
							<p>Дата</p>
							<p>Тип</p>
							<p>Группа</p>
							<p>Цена / Моя доля</p>
							<p>Описание</p>
						</div>
					</div>
				)}
				<div className={cls.container}>
					{isLoaded ? (
						(search || (startDate && endDate) ? renderList : orders).map(el => (
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
						))
					) : (
						<div className={cls.loader}>
							<Loader />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default MyOrders
