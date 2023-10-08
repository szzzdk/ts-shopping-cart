import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

type ShoppingCartContext = {
    openCart: () => void
    closeCart: () => void
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext) // контекст ShoppingCartContext с начальным пустым значением. 
//Контекст будет использоваться для передачи функций и данных между компонентами в дереве React.

export function useShoppingCart() { //Это функция-хук useShoppingCart, которая использует хук useContext для доступа к данным и функциям, 
    return useContext(ShoppingCartContext) // предоставляемым контекстом ShoppingCartContext. Когда вы вызываете этот хук внутри функционального компонента, он возвращает объект с функциями и данными корзины покупок.
}

export function ShoppingCartProvider({ children } : //  компонент ShoppingCartProvider, который предоставляет контекст для всего дерева компонентов.
    ShoppingCartProviderProps) { //  Он использует ShoppingCartContext.Provider для предоставления значений (функций и данных) контекста своим дочерним компонентам.
        const [ isOpen, setIsOpen ] = useState(false)
        const [cartItems, setCartItems] = useLocalStorage<CartItem[]
        >(
            "shopping-cart",
            []
        ) // Корзина покупок хранится в состоянии cartItems

        const cartQuantity = cartItems.reduce( // cartQuantity вычисляется на основе содержимого корзины.
            (quantity, item) => item.quantity + quantity, 
            0
        )
        

        const openCart = () => setIsOpen(true)
        const closeCart = () => setIsOpen(false)

        function getItemQuantity(id: number) {
            return cartItems.find(item => item.id === id)?.quantity || 0
        }

        function increaseCartQuantity(id: number) {
            setCartItems(currItems => { // Внутри функции setCartItems используется функция обратного вызова (currItems) => { ... }, которая получает текущее состояние cartItems в качестве параметра.
                if(currItems.find(item => item.id === id) == null) { //если в текущих элементах корзины нет элемента с id,переданным в функцию
                    return [...currItems, { id, quantity: 1 }] // то создается новый элемент с id и устанавливается начальное количество quantity в 1, и этот новый элемент добавляется в массив currItems.
                } else {
                    return currItems.map(item => { // Если элемент с указанным id уже существует в корзине (currItems)
                        if (item.id === id) { // то выполняется обновление состояния: текущие элементы currItems перебираются с помощью .map(),
                            return { ...item, quantity: item.quantity + 1} // и для элемента с совпадающим id увеличивается количество quantity на 1, остальные элементы остаются без изменений.
                        } else {
                            return item
                        }
                    })
                }
            })
        }

        function decreaseCartQuantity(id: number) {
            setCartItems(currItems => { 
                if(currItems.find(item => item.id === id)?.quantity === 1) { // если текущее количество товара с указанным id равно 1, 
                    return currItems.filter(item => item.id !== id) // Таким образом, выражение currItems.filter(item => item.id !== id) фильтрует массив currItems, удаляя из него все элементы, у которых id совпадает с id
                } else {
                    return currItems.map(item => { 
                        if (item.id === id) {
                            return { ...item, quantity: item.quantity - 1}
                        } else {
                            return item
                        }
                    })
                }
            })
        }

        function removeFromCart(id: number) {
             setCartItems(currItems => {
                return currItems.filter(item => item.id !== id)
             })
        }

      
        return ( // Значения функций и данных передаются в контекст через value prop компонента ShoppingCartContext.Provider. Это позволяет дочерним компонентам использовать хук useShoppingCart() для доступа к функциям и данным корзины покупок.
            <ShoppingCartContext.Provider 
                value={{
                    getItemQuantity, 
                    increaseCartQuantity, 
                    decreaseCartQuantity,
                    removeFromCart,
                    openCart,
                    closeCart,
                    cartItems,
                    cartQuantity,
                }}
            >
                {children}
                <ShoppingCart isOpen={isOpen} />
            </ShoppingCartContext.Provider>
        )
}