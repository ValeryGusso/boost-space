import cls from './Row.module.css'

const Row = ({ date, type, group, price, tax, currency, description, orderLink, priceLink }) => {
	const parse = new Date(date)
	const names = []
	group.map(el => names.push(el.name))
	return (
		<div className={cls.container}>
			<div type="date">
				<p>{`${parse.getDate() >= 10 ? parse.getDate() : '0' + parse.getDate()}.${
					parse.getMonth() + 1 >= 10 ? parse.getMonth() + 1 : '0' + (parse.getMonth() + 1)
				}.${parse.getFullYear().toString().substring(2, 4)}`}</p>
			</div>
			<div className={orderLink ? cls.link : ''}>
				{orderLink ? (
					<a href={orderLink} target="_blank">
						{type}
					</a>
				) : (
					<p>{type}</p>
				)}
			</div>
			<div className="group">
				<p>{names.join(', ')}</p>
			</div>
			<div className={priceLink ? cls.link : ''}>
				{priceLink ? (
					<a href={priceLink} target="_blank">
						{price.toFixed(2)} {currency === 'usd' ? '$' : '₽'}
					</a>
				) : (
					<p>
						{price.toFixed(2)} {currency === 'usd' ? '$' : '₽'}
					</p>
				)}
			</div>
			<div className="part">
				<p>
					{((price - price * (tax / 100)) / names.length).toFixed(2)} {currency === 'usd' ? '$' : '₽'}
				</p>
			</div>
			<div className="discription">
				<p>{description ? description : '---'}</p>
			</div>
		</div>
	)
}

export default Row
