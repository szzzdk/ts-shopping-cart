import { StoreItem } from "../components/StoreItem"
import storeItems from "../data/items.json"
import { Col, Row } from "react-bootstrap"

//<Row> - это компонент из react-bootstrap, который создает горизонтальный ряд (строку) 
// для экранов среднего размера (md) будет отображаться 2 столбца, для маленьких экранов (xs) - 1 столбец, 
// и для больших экранов (lg) - 3 столбца. className="g-3" добавляет отступы между столбцами, чтобы создать промежутки между товарами.
// для каждого товара создается компонент Col, который содержит компонент StoreItem. Атрибут key устанавливается в уникальное значение item.id
export function Store() {
    return (
        <>
        <Row md={2} xs={1} lg={3} className="g-3"> 
            {storeItems.map(item => (
                <Col key={item.id}><StoreItem {...item} /></Col>
            ))}
        </Row>
        </>
    )
}