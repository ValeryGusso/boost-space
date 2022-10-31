import { useSelector } from 'react-redux'
import cls from './AddOrder.module.css'
import ruble from '../../assets/img/ruble.jpg'
import dollar from '../../assets/img/dollar.png'
import cross from '../../assets/img/cross.svg'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { ru } from 'date-fns/locale'
import { DatePicker } from 'react-nice-dates'
import axios from '../../axiosSettings'
import { useNavigate, useParams } from 'react-router'
import { useRef } from 'react'

const AddOrder = () => {
	const navigate = useNavigate()
	const params = useParams()
	const { users } = useSelector(state => state.users)
	const isAdmin = useSelector(state => state.auth.isAdmin)
	const [showList, setShowList] = useState(false)
	const [showGroup, setShowGroup] = useState(false)
	const [date, setDate] = useState(new Date())
	const [type, setType] = useState('')
	const [orderLink, setOrderLink] = useState()
	const [group, setGroup] = useState([])
	const [price, setPrice] = useState(0)
	const [priceLink, setPriceLink] = useState()
	const [tax, setTax] = useState(8)
	const [currency, setCurrency] = useState('$')
	const [description, setDescription] = useState('')
	const [showSuccess, setShowSuccess] = useState(false)
	const successParams = useRef()

	useEffect(() => {
		if (params.id) {
			axios()
				.get('/orders/' + params.id)
				.then(res => {
					const groupInfo = res.data.group
					const newGroup = []

					groupInfo.map(el => {
						users.map(user => {
							if (user.id === el) {
								newGroup.push(user)
							}
						})
					})

					setDate(new Date(res.data.date))
					setType(res.data.type)
					setGroup(newGroup)
					setPrice(res.data.price)
					setTax(res.data.tax)
					setCurrency(res.data.currency === 'usd' ? '$' : '₽')
					setDescription(res.data.description)
					setOrderLink(res.data.orderLink)
					setPriceLink(res.data.priceLink)
				})
		} else {
			setDate(new Date())
			setType('')
			setGroup([])
			setPrice(0)
			setTax(8)
			setCurrency('$')
			setDescription('')
			setOrderLink('')
			setPriceLink('')
		}
	}, [params])

	useEffect(() => {
		if (showSuccess) {
			setShowSuccess(false)
		}
	}, [price, group, type, date, currency, tax, description, orderLink, priceLink])

	function changeType(event) {
		setType(event.target.value)
	}

	function changePrice(event) {
		if (event.target.value >= 0) {
			setPrice(event.target.value)
		}
	}

	function togle() {
		setShowList(!showList)
	}

	function setUsd() {
		setCurrency('$')
		togle()
	}

	function setRub() {
		setCurrency('₽')
		togle()
	}

	function changeTax(event) {
		const val = event.target.value

		if (val >= 0) {
			setTax(val)
		}
	}

	function changeDescription(event) {
		setDescription(event.target.value)
	}

	function changeOrderLink(event) {
		setOrderLink(event.target.value)
	}

	function changePriceLink(event) {
		setPriceLink(event.target.value)
	}

	function selectGroup() {
		setShowGroup(true)
	}

	function hideGroup() {
		setShowGroup(false)
	}

	function pushGroup(player) {
		const prev = [...group]
		prev.push(player)
		setGroup(prev)
	}

	function spliceGroup(index) {
		const prev = [...group]
		prev.splice(index, 1)
		setGroup(prev)
	}

	async function save() {
		const reqGroup = []
		group.map(el => reqGroup.push(el.id))

		const req = {
			currency: currency === '$' ? 'usd' : 'rub',
			group: reqGroup,
			date,
			type,
			price,
			tax,
			description,
			orderLink,
			priceLink,
		}

		if (group.length > 0 && type && price) {
			if (params.id) {
				await axios().patch('/orders/' + params.id, { ...req })
				setShowSuccess(true)
				successParams.current = { collor: '#348f50', text: 'Заказ успешно изменён' }
			} else {
				await axios().post('/orders', { ...req })
				setShowSuccess(true)
				successParams.current = { collor: '#348f50', text: 'Заказ успешно создан' }
			}
		} else {
			setShowSuccess(true)
			successParams.current = { collor: '#EF3B36', text: 'Ошибка' }
		}
	}

	if (!isAdmin) {
		return navigate('/home')
	}

	return (
		<div className={cls.wrapper}>
			<div className={cls.field}>
				<div className={cls.date}>
					<p>Дата</p>
					<DatePicker date={date} onDateChange={setDate} locale={ru}>
						{({ inputProps, focused }) => <input className={'input' + (focused ? ' -focused' : '')} {...inputProps} />}
					</DatePicker>
				</div>
				<div className={cls.type}>
					<p>Тип</p>
					<input type="text" value={type} onChange={changeType} />
				</div>
				<div className={cls.group}>
					{showGroup && (
						<img className={cls.close} src={cross} alt="close" title="Закрыть список" onClick={hideGroup} />
					)}
					<p>Группа</p>
					<div className={classNames(cls.groupplace, showGroup ? cls.activegroup : '')} onClick={selectGroup}>
						<ul>
							{group.map((el, i) => (
								<li key={el.id + i} onClick={() => spliceGroup(i)}>
									{el.name}
								</li>
							))}
						</ul>
					</div>
					{showGroup && (
						<div className={cls.grouplist}>
							{users.map(el => (
								<li key={el.id} onClick={() => pushGroup(el)}>
									{el.name}
								</li>
							))}
						</div>
					)}
				</div>
				<div className={cls.price}>
					<p>Цена</p>
					<input type="number" value={price} onChange={changePrice} />
					<div>
						{' '}
						<p>
							Организаторский <br /> сбор(%):{' '}
						</p>{' '}
						<input type="number" value={tax} onChange={changeTax} />
					</div>
				</div>
				<div className={cls.currency}>
					<p>Валюта</p>
					<div onClick={togle} className={showList ? cls.activegroup : ''}>
						{currency}
					</div>
					<ul className={classNames(cls.setcurrency, showList ? cls.show : cls.hide)}>
						<li onClick={setUsd}>
							<img src={dollar} alt="" />
						</li>
						<li onClick={setRub} style={{ '--y': '11vmin' }}>
							<img src={ruble} alt="" />
						</li>
					</ul>
				</div>
				<div className={cls.description}>
					<p>Опизание</p>
					<input type="text" placeholder="Заметка" value={description} onChange={changeDescription} />
					<textarea
						type="text"
						placeholder="Скрин выполнения заказа"
						value={orderLink}
						onChange={changeOrderLink}
					></textarea>
					<textarea type="text" placeholder="Скрин ценника" value={priceLink} onChange={changePriceLink}></textarea>
					<button onClick={save} disabled={!(type.length > 2 && group.length > 0 && price > 0 && !showSuccess)}>
						{params.id ? 'Редактировать' : 'Сохранить'}
					</button>
					{showSuccess && (
						<p
							className={classNames(cls.success, showSuccess ? cls.successShow : '')}
							style={{ '--color': successParams.current.collor }}
						>
							{successParams.current.text}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default AddOrder
