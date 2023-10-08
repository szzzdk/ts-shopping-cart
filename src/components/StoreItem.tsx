import { Button, Card } from "react-bootstrap"
import { useShoppingCart } from "../context/ShoppingCartContext"
import { formatCurrency } from "../utilities/formatCurrency"

type StoreItemProps = { // Определяется тип StoreItemProps, который представляет свойства, ожидаемые для каждого товара. Эти свойства включают id, name, price и imgUrl.
  id: number
  name: string
  price: number
  imgUrl: string
}

//StoreItem использует хук useShoppingCart для доступа к функциям управления корзиной покупок, и затем использует эти функции для получения количества конкретного товара в корзине (quantity)

export function StoreItem({ id, name, price, imgUrl }: StoreItemProps) { 
  const { // с помощью деструктуризации объекта, компонента StoreItem извлекает четыре функции: getItemQuantity, increaseCartQuantity, decreaseCartQuantity и removeFromCart.
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart()
  const quantity = getItemQuantity(id) // Функция getItemQuantity служит для получения количества данного товара в корзине покупок и возвращает это количество в переменной quantity.

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={imgUrl}
        height="200px"
        style={{ objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
          <span className="fs-2">{name}</span>
          <span className="ms-2 text-muted">{formatCurrency(price)}</span>
        </Card.Title>
        <div className="mt-auto">
          {quantity === 0 ? ( // quantity - количество данного товара в корзине, полученное с помощью функции getItemQuantity(id) из контекста корзины.
            <Button className="w-100" onClick={() => increaseCartQuantity(id)}>
              + Add To Cart
            </Button>
          ) : (
            <div
              className="d-flex align-items-center flex-column"
              style={{ gap: ".5rem" }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ gap: ".5rem" }}
              >
                <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
                <div>
                  <span className="fs-3">{quantity}</span> in cart
                </div>
                <Button onClick={() => increaseCartQuantity(id)}>+</Button>
              </div>
              <Button
                onClick={() => removeFromCart(id)}
                variant="danger"
                size="sm"
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}