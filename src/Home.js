import { AddShoppingCartOutlined } from '@material-ui/icons'
import React, { useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import './Home.css'
import ProduceDetails from './ProduceDetails'
import { useStateValue } from './StateProvider'
import { auth } from './firebase'
import { useHistory } from 'react-router-dom'

function Home() {
    const [{details, user}, dispatch] = useStateValue()
    const history = useHistory()
    const [nav, setNav] = useState('all')

    const handleAuthentication = () => {
        if (user) {
            auth.signOut()
            dispatch({
              type: 'SET_USER',
              user: null
            })
        } else {
            dispatch({
                type: 'SET_LASTURL',
                lastUrl: window.location.pathname
            })
              
            history.push('/login')
        }
    }

    const setDetails = (price, title, image) => {
        dispatch({
            type: 'ADD_PRODUCE_DETAILS',
            produceDetails: {
                price,
                title,
                image
            }
        })
        dispatch({
            type: 'SHOW_DETAILS',
            details: true
        })
    }

    const displayMessage = (severity, message) => {
        dispatch({
            type: 'ADD_FLASH_MESSAGE',
            message: {
                severity,
                message,
                duration: 5000
            }
        })

        dispatch({
            type: 'SHOW_FLASH_MESSAGE',
            showFlash: true
        })
    }

    const handleAddToBasket = async (price, title, image) => {
        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                title,
                image,
                price,
                rating: 4.3,
                quantity: 1,
            }
        })

        displayMessage('success', 'Produce added to basket')
    }

    const crap = 'data:image/jpeg;base64,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'
    
    return (
        <>
        <div className="home" style={{
                  height: details ? 'calc(100vh - 150px)' : '',
                  overflow: details ? 'hidden' : ''}}>
            <section className="home__top">
                <aside className="home__topLeft">
                    <h4>All Categories</h4>
                    <nav>Fruit</nav>
                    <nav>Vegetables</nav>
                    <nav>Fresh Meat</nav>
                    <nav>Ocean Foods</nav>
                    <nav>Cereals</nav>
                    <nav>Seeds</nav>
                    <nav>Dairies</nav>
                    <nav>Poultry</nav>
                </aside>
                <div className="home__topRight">
                    <div>
                        <input type="text" placeholder="What do you need?" />
                        <button>Search</button>
                        <div onClick={handleAuthentication}>
                            Hello, <span>{user ? user.displayName : 'Guest'}</span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h5>FRUIT FRESH</h5>
                            <h1>Vegetable<span>100% Organic</span></h1>
                            <p>Free Pickup and Delivery Available</p>
                            <button>SHOP NOW</button>
                        </div>
                        <div>
                            <img 
                              src='https://p.kindpng.com/picc/s/115-1153469_vegetable-transparent-arts-clip-art-royalty-free-download.png' 
                              alt='' />
                        </div>
                    </div>
                </div>
            </section>
            <section className="home__bottom">
                <div>
                    <h2><span>Category</span></h2>
                    <picture>
                        <div>
                            <img src="https://p.kindpng.com/picc/s/115-1153469_vegetable-transparent-arts-clip-art-royalty-free-download.png" alt ="" />
                            <span>Fruits</span>
                        </div>
                        <div>
                            <img src="https://www.pngkey.com/png/detail/266-2666779_products-manufactures-exporters-and-suppliers-of-dairy-milk.png" alt ="" />
                            <span>Dairies</span>
                        </div>
                        <div>
                            <img src={crap} alt="" />
                            <span>Ocean Food</span>
                        </div>
                        <div>
                            <img src="https://p.kindpng.com/picc/s/139-1392294_veal-raw-meats-hd-png-download.png" alt ="" />
                            <span>Fresh Meat</span>
                        </div>
                    </picture>
                </div>
                <div>
                    <h2><span>Products</span></h2>
                    <div>
                        <nav onClick={() => setNav('all')} style={{borderBottom: nav === 'all' ? 'solid 2px rgb(0, 172, 0' : ''}}>All</nav>
                        <nav onClick={() => setNav('dairy')} style={{borderBottom: nav === 'dairy' ? 'solid 2px rgb(0, 172, 0' : ''}}>Dairy</nav>
                        <nav onClick={() => setNav('meat')} style={{borderBottom: nav === 'meat' ? 'solid 2px rgb(0, 172, 0' : ''}}>Meat</nav>
                        <nav onClick={() => setNav('fastFood')} style={{borderBottom: nav === 'fastFood' ? 'solid 2px rgb(0, 172, 0' : ''}}>Fast Foods</nav>
                        <nav onClick={() => setNav('vegetable')} style={{borderBottom: nav === 'vegetable' ? 'solid 2px rgb(0, 172, 0' : ''}}>Vegetables</nav>
                    </div>
                    <picture>
                        <div 
                          style={{display: (nav === 'all' || nav === "fruit") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(2000, 'Alphonso Mango', 'https://www.pngarea.com/pngm/210/1883764_mangoes-png-alphonso-mango-box-8-hd-png.png')}/>
                                <img src="https://www.pngarea.com/pngm/210/1883764_mangoes-png-alphonso-mango-box-8-hd-png.png" alt ="" 
                                    onClick={() => setDetails(2000, 'Alphonso Mango', 'https://www.pngarea.com/pngm/210/1883764_mangoes-png-alphonso-mango-box-8-hd-png.png')}/>
                            </div>
                            <div
                                    onClick={() => setDetails(2000, 'Alphonso Mango', 'https://www.pngarea.com/pngm/210/1883764_mangoes-png-alphonso-mango-box-8-hd-png.png')}>
                                <span>Alphonso Mango</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(2000).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "fastFood") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(2200, 'Burger', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaMNAtYGYJJ7BCaZzuuJ7506dzbY_FRSkElw&usqp=CAU')}/>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaMNAtYGYJJ7BCaZzuuJ7506dzbY_FRSkElw&usqp=CAU" alt ="" 
                                    onClick={() => setDetails(2200, 'Burger', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaMNAtYGYJJ7BCaZzuuJ7506dzbY_FRSkElw&usqp=CAU')}/>
                            </div>
                            <div
                              onClick={() => setDetails(2200, 'Burger', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaMNAtYGYJJ7BCaZzuuJ7506dzbY_FRSkElw&usqp=CAU')}>
                                <span>Burger</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(2200).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "fastFood") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(3200, 'Pizza', 'https://www.pngitem.com/pimgs/m/54-545087_pizza-hd-png-download.png')}/>
                                <img src="https://www.pngitem.com/pimgs/m/54-545087_pizza-hd-png-download.png" alt ="" 
                                    onClick={() => setDetails(3200, 'Pizza', 'https://www.pngitem.com/pimgs/m/54-545087_pizza-hd-png-download.png')}/>
                            </div>
                            <div
                                onClick={() => setDetails(3200, 'Pizza', 'https://www.pngitem.com/pimgs/m/54-545087_pizza-hd-png-download.png')}>
                                <span>Pizza</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(3200).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "meat") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(1900, 'Fresh Beef', 'https://www.nicepng.com/png/detail/217-2177521_beef-cut-beef-fresh-meat.png')}/>
                                <img src="https://www.nicepng.com/png/detail/217-2177521_beef-cut-beef-fresh-meat.png" alt ="" 
                                    onClick={() => setDetails(1900, 'Fresh Beef', 'https://www.nicepng.com/png/detail/217-2177521_beef-cut-beef-fresh-meat.png')}/>
                            </div>
                            <div
                                onClick={() => setDetails(1900, 'Fresh Beef', 'https://www.nicepng.com/png/detail/217-2177521_beef-cut-beef-fresh-meat.png')}>
                                <span>Fresh Beef</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(1900).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        
                        <div 
                          style={{display: (nav === 'all' || nav === "dairy") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(6000, 'Pure Milk', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa18UpXeSPSiVbWN3gWt8rwN7dj8vZeaLo7g&usqp=CAU')}/>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa18UpXeSPSiVbWN3gWt8rwN7dj8vZeaLo7g&usqp=CAU" alt ="" 
                                    onClick={() => setDetails(6000, 'Pure Milk', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa18UpXeSPSiVbWN3gWt8rwN7dj8vZeaLo7g&usqp=CAU')}/>
                            </div>
                            <div
                                onClick={() => setDetails(6000, 'Pure Milk', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa18UpXeSPSiVbWN3gWt8rwN7dj8vZeaLo7g&usqp=CAU')}>
                                <span>Pure Milk</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(6000).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "fruit") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(900, 'Juice Banana', 'https://www.clipartkey.com/mpngs/m/39-392844_cavendish-fruit-banana-powder-download-hd-png-clipart.png')}/>
                                <img src="https://www.clipartkey.com/mpngs/m/39-392844_cavendish-fruit-banana-powder-download-hd-png-clipart.png" alt ="" 
                                    onClick={() => setDetails(900, 'Juice Banana', 'https://www.clipartkey.com/mpngs/m/39-392844_cavendish-fruit-banana-powder-download-hd-png-clipart.png')}/>
                            </div>
                            <div
                                onClick={() => setDetails(900, 'Juice Banana', 'https://www.clipartkey.com/mpngs/m/39-392844_cavendish-fruit-banana-powder-download-hd-png-clipart.png')}>
                                <span>Juice Banana</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(900).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "vegetable") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(500, 'Tomato', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSDdQNpPIRFOZsy0XoTPHXpcqgy7CzW84-M1WsOYomw0u_j0wW3RuFrkbXoJw78n9G18I&usqp=CAU')}/>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSDdQNpPIRFOZsy0XoTPHXpcqgy7CzW84-M1WsOYomw0u_j0wW3RuFrkbXoJw78n9G18I&usqp=CAU" alt ="" 
                                    onClick={() => setDetails(500, 'Tomato', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSDdQNpPIRFOZsy0XoTPHXpcqgy7CzW84-M1WsOYomw0u_j0wW3RuFrkbXoJw78n9G18I&usqp=CAU')}/>
                            </div>
                            <div
                                onClick={() => setDetails(500, 'Tomato', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSDdQNpPIRFOZsy0XoTPHXpcqgy7CzW84-M1WsOYomw0u_j0wW3RuFrkbXoJw78n9G18I&usqp=CAU')}>
                                <span>Tomato</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(500).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "vegetable") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small"
                                    onClick={() => handleAddToBasket(1000, 'Cabbage', 'https://lh3.googleusercontent.com/proxy/EYoOxlYmN0YuIG50qKD7UR1BiX9SlxLAsxATio_71ENYXnUl-YP5hehW_Oui5Upjv0oDw5GBepBB2NVxe64QaIOV-MpHS0AsgOPIB-0fKvk5wLYlxlqF-6yf')}/>
                                <img src="https://lh3.googleusercontent.com/proxy/EYoOxlYmN0YuIG50qKD7UR1BiX9SlxLAsxATio_71ENYXnUl-YP5hehW_Oui5Upjv0oDw5GBepBB2NVxe64QaIOV-MpHS0AsgOPIB-0fKvk5wLYlxlqF-6yf" alt ="" 
                                    onClick={() => setDetails(1000, 'Cabbage', 'https://lh3.googleusercontent.com/proxy/EYoOxlYmN0YuIG50qKD7UR1BiX9SlxLAsxATio_71ENYXnUl-YP5hehW_Oui5Upjv0oDw5GBepBB2NVxe64QaIOV-MpHS0AsgOPIB-0fKvk5wLYlxlqF-6yf')}/>
                            </div>
                            <div
                                onClick={() => setDetails(1000, 'Cabbage', 'https://lh3.googleusercontent.com/proxy/EYoOxlYmN0YuIG50qKD7UR1BiX9SlxLAsxATio_71ENYXnUl-YP5hehW_Oui5Upjv0oDw5GBepBB2NVxe64QaIOV-MpHS0AsgOPIB-0fKvk5wLYlxlqF-6yf')}>
                                <span>Cabbage</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(1000).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        
                        <div 
                          style={{display: (nav === 'all' || nav === "vegetable") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(4000, 'Fresh Fruits', 'https://p.kindpng.com/picc/s/115-1153469_vegetable-transparent-arts-clip-art-royalty-free-download.png')}/>
                                <img src="https://p.kindpng.com/picc/s/115-1153469_vegetable-transparent-arts-clip-art-royalty-free-download.png" alt ="" 
                                    onClick={() => setDetails(4000, 'Fresh Fruits', 'https://p.kindpng.com/picc/s/115-1153469_vegetable-transparent-arts-clip-art-royalty-free-download.png')}/>
                            </div>
                            <div
                                onClick={() => setDetails(4000, 'Fresh Fruits', 'https://p.kindpng.com/picc/s/115-1153469_vegetable-transparent-arts-clip-art-royalty-free-download.png')}>
                                <span>Fresh Fruits</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(4000).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "dairy") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small"
                                    onClick={() => handleAddToBasket(3400, 'Healthy Dairies', 'https://www.pngkey.com/png/detail/266-2666779_products-manufactures-exporters-and-suppliers-of-dairy-milk.png')} />
                                <img src="https://www.pngkey.com/png/detail/266-2666779_products-manufactures-exporters-and-suppliers-of-dairy-milk.png" alt ="" 
                                    onClick={() => setDetails(3400, 'Healthy Dairies', 'https://www.pngkey.com/png/detail/266-2666779_products-manufactures-exporters-and-suppliers-of-dairy-milk.png')}/>
                            </div>
                            <div
                                onClick={() => setDetails(3400, 'Healthy Dairies', 'https://www.pngkey.com/png/detail/266-2666779_products-manufactures-exporters-and-suppliers-of-dairy-milk.png')}>
                                <span>Healty Dairies</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(3400).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "meat") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(5000, 'Delicious Crap', crap)}/>
                                <img src={crap} alt="" 
                                    onClick={() => setDetails(5000, 'Delicious Crap', crap)}/>
                            </div>
                            <div
                                onClick={() => setDetails(5000, 'Delicious Crap', crap)}>
                                <span>Delicious Crab</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(5000).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                        <div 
                          style={{display: (nav === 'all' || nav === "meat") ? '' : 'none'}}
                        >
                            <div>
                                <AddShoppingCartOutlined className="home__addIcon" fontSize="small" 
                                    onClick={() => handleAddToBasket(2500, 'Seasoned Chicken', 'https://p.kindpng.com/picc/s/139-1392294_veal-raw-meats-hd-png-download.png')}/>
                                <img src="https://p.kindpng.com/picc/s/139-1392294_veal-raw-meats-hd-png-download.png" alt ="" 
                                    onClick={() => setDetails(2500, 'Seasoned Chicken', 'https://p.kindpng.com/picc/s/139-1392294_veal-raw-meats-hd-png-download.png')}/>
                            </div>
                            <div
                                onClick={() => setDetails(2500, 'Seasoned Chicken', 'https://p.kindpng.com/picc/s/139-1392294_veal-raw-meats-hd-png-download.png')}>
                                <span>Seasoned Chicken</span>
                                <span>
                                    <CurrencyFormat 
                                        renderText={(value) => (
                                            value
                                        )}
                                        decimalScale={2}
                                        value={(2500).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₦"}
                                    />  
                                </span>
                            </div>
                        </div>
                    </picture>
                </div>
            </section>
        </div>
        {details && <ProduceDetails />}
        </>
    )
}

export default Home
