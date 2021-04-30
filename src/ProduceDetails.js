import React, { useEffect, useState } from 'react'
import { Add, Cancel, NavigateBefore, NavigateNext, Remove, Star } from '@material-ui/icons'
import './ProduceDetails.css'
import { IconButton } from '@material-ui/core'
import { useStateValue } from './StateProvider'
import CurrencyFormat from 'react-currency-format'

function ProduceDetails() {
    const [{produceDetails, details}, dispatch] = useStateValue()
    const [quantity, setQuantity] = useState(1)
    const [displayStatus, setDisplayStatus] = useState('information')
    const [displayImage, setDisplayImage] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0);
    const rating = 4.3
    let resizeWindow = () => {
      setWindowWidth(window.innerWidth);
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

    const handleAddToBasket = async () => {
        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                title: produceDetails.title,
                image: produceDetails.image,
                price: produceDetails.price,
                rating: 4.3,
                quantity: parseInt(quantity),
            }
        })

        displayMessage('success', 'Produce added to basket')
    }

    const closeDetails = () => {
        dispatch({
            type: 'SHOW_DETAILS',
            details: false
        })
    }

    useEffect(() => {
      resizeWindow();
      window.addEventListener("resize", resizeWindow);
      return () => window.removeEventListener("resize", resizeWindow);
    }, []);

    const activeNavStyle = {
        color: 'rgb(0, 172, 0)',
        borderBottom: 'solid 3px rgb(0, 172, 0)'
    }

    return (
        <>
        <div 
            className="produceDetails"
            style={{right: details ? '0' : ''}}
        >
            <div className="produceDetails__top">
                <div className="produceDetails__topNav produceDetails__navSmall">
                    <div 
                        className="produceDetails__topNavLeft"
                        onClick={closeDetails}
                    >
                        <span>Back to Shopping</span> <NavigateNext fontSize="small" />
                    </div>
                </div>
                <div className="produceDetails__categoryHead">
                    Home / category / <span>{produceDetails.title}</span>
                </div>
                <div className="produceDetails__topInfo">
                    <div className="produceDetails__topLeft">
                        <div className="produceDetails__topImage">
                            <div>
                                <img 
                                className="produceDetails__imageMain"
                                src={produceDetails.image} 
                                alt=""
                                onClick={() => setDisplayImage(true)}
                                />
                            </div>
                            <div className="produceDetails__topGallary">
                                <img 
                                src={produceDetails.image} 
                                alt=""
                                style={{cursor:'pointer'}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="produceDetails__topRight">
                        <div className="produceDetails__topNav produceDetails__navLarge">
                            <div 
                                className="produceDetails__topNavLeft"
                                onClick={closeDetails}
                            >
                                <NavigateBefore fontSize="small" /> <span>Back to Shopping</span>
                            </div>
                        </div>
                        <div className="produceDetails__topTitle">
                            {produceDetails.title}
                        </div>
                        <div className="produceDetails__topRating">
                            <span>(2 reviews)</span>
                            <div className="produceDetails__topStar">
                                <p 
                                style={{
                                    color: rating >= 0.5 ? 'rgb(0, 172, 0)' : ''
                                    }}
                                className="produceDetails__star"
                                >
                                    <Star fontSize="small" />
                                </p>
                                <p 
                                style={{
                                    color: rating >= 1.5 ? 'rgb(0, 172, 0)' : ''
                                    }}
                                className="produceDetails__star"
                                >
                                    <Star fontSize="small" />
                                </p>
                                <p 
                                style={{
                                    color: rating >= 2.5 ? 'rgb(0, 172, 0)' : ''
                                    }}
                                className="produceDetails__star"
                                >
                                    <Star fontSize="small" />
                                </p>
                                <p 
                                style={{
                                    color: rating >= 3.5 ? 'rgb(0, 172, 0)' : ''
                                    }}
                                className="produceDetails__star"
                                >
                                    <Star fontSize="small" />
                                </p>
                                <p 
                                style={{
                                    color: rating >= 4.5 ? 'rgb(0, 172, 0)' : ''
                                    }}
                                className="produceDetails__star"
                                >
                                    <Star fontSize="small" />
                                </p>
                            </div>
                        </div>
                        <div className="produceDetails__topPrice">
                            <CurrencyFormat 
                                renderText={(value) => (
                                    value
                                )}
                                decimalScale={2}
                                value={produceDetails.price}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"₦"}
                            />
                        </div>
                        <div className="produceDetails__topDetails">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                        </div>
                        <div className="produceDetails__topDetails">
                            <div className="produceDetails__topDeliveryHeader">
                                Delivery Information
                            </div>
                            <div className="produceDetails__topDelivery">
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                        </div>
                        <div className="produceDetails__actions">
                            <div>
                                <input 
                                    value={quantity < 1 ? 1 : quantity} 
                                    type="number" 
                                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                    onChange={e => setQuantity(e.target.value)} 
                                />
                                <div>
                                    <button>
                                        <Add style={{fontSize: '14px'}} onClick={() => setQuantity(parseInt(quantity) + 1)} />
                                    </button>
                                    <button>
                                        <Remove style={{fontSize: '14px'}} onClick={() => {if(parseInt(quantity) > 1) setQuantity(parseInt(quantity) - 1)}} />
                                    </button>
                                </div>
                            </div>
                            <button
                                style={{backgroundColor: 'yellowgreen'}}
                                onClick={handleAddToBasket}
                            >
                                Add to Basket
                            </button>
                        </div>
                        <div className="produceDetails__category">
                            <div>
                                <span>From</span>: <span style={{color: 'rgb(0, 172, 0)'}}>agrochainer</span>
                            </div>                        
                        </div>
                    </div>
                </div>
            </div>
            <div className="produceDetails__bottom">
                <div className="produceDetails__bottomNav">
                    <div 
                    style={displayStatus === "information" ? activeNavStyle : {}}
                    onClick={() => setDisplayStatus("information")}
                    >
                        {windowWidth < 321 ? 'Information' : 'Additional Information'}
                    </div>
                    <div 
                    style={displayStatus === "reviews" ? activeNavStyle : {}}
                    onClick={() => setDisplayStatus("reviews")}
                    >
                        Review(2)
                    </div>
                </div>
                {displayStatus === "information" &&
                <div className="produceDetails__bottomInfo">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tincidunt vehicula felis sed dignissim. Pellentesque ut congue ex. Nam ultrices lacinia lectus quis euismod. Morbi ac ante quis mi fringilla tincidunt ac at libero. Donec vulputate lectus non gravida dignissim. Nullam feugiat ultrices mi non venenatis. Vivamus fermentum pharetra dictum. Duis mi lectus, facilisis at euismod nec, elementum et erat. Sed at consectetur risus, id convallis arcu</p>
                    <p>Nullam sed arcu a nisi ornare pharetra eu eu enim. Ut eget neque sed erat pulvinar dapibus id ut erat. Aenean nec rhoncus neque. Duis dictum pulvinar eros, vitae feugiat diam finibus vel. Fusce mollis tristique iaculis. Maecenas pretium magna ut interdum iaculis. Ut fermentum libero sem, a feugiat ex placerat interdum. Curabitur vel cursus leo. Sed volutpat et odio ut malesuada. Vivamus posuere vestibulum mauris ac dapibus. Quisque nec elementum eros. Proin imperdiet, arcu ut varius cursus, purus turpis lobortis est, quis ultricies quam ligula vitae mauris. Aliquam ac lectus in ante imperdiet imperdiet</p>
                    <p>Praesent et pellentesque felis, eu porttitor metus. Cras orci erat, laoreet facilisis tincidunt commodo, posuere sed ipsum. Sed ullamcorper nisl eu magna molestie, vitae venenatis justo faucibus. Aliquam erat volutpat. Fusce laoreet finibus arcu a rutrum. Cras bibendum mi massa, quis consequat lectus suscipit id. Quisque dictum, odio id maximus condimentum, enim nibh commodo neque, at egestas ipsum ex at ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras eu arcu eget nunc euismod ultrices. Sed enim enim, malesuada nec velit sed, fringilla eleifend enim. Pellentesque facilisis tempor neque, sed mollis augue eleifend a. Ut interdum ultrices malesuada. Sed dignissim vehicula enim, non cursus eros lobortis ac</p>
                    <p>Vivamus a massa augue. Quisque placerat, risus ut finibus commodo, enim risus rutrum mauris, in pharetra arcu felis et leo. Pellentesque maximus cursus massa eu auctor. Maecenas eleifend augue dolor, at scelerisque ex tempus nec. Morbi aliquam est dolor, ut commodo lorem convallis at. In dapibus nunc nec nibh facilisis, sit amet ultricies magna malesuada. Sed ultrices mattis justo, a ornare augue feugiat non. In hac habitasse platea dictumst. Sed nec interdum massa, non auctor libero</p>
                    <p>Morbi condimentum tellus id massa fermentum, a consectetur ipsum ultrices. Proin nibh risus, volutpat sed placerat vel, vulputate eu lacus. Proin aliquam finibus tortor quis varius. Duis vitae sem nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet metus cursus, consectetur lorem non, rhoncus nisl. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin ut elit vel tellus dictum volutpat. In hac habitasse platea dictumst. Aenean commodo euismod nisi, vitae egestas augue. Praesent vehicula congue finibus. Aliquam scelerisque nunc non gravida iaculis. Nulla facilisi. Morbi ornare ipsum eleifend, hendrerit sem nec, rhoncus sem. Aenean nec elementum lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae</p>
                </div>
                }
                {displayStatus === "reviews" &&
                <div className="produceDetails__bottomReview">
                    <div className="produceDetails__topRating">
                        <div className="produceDetails__topStar">
                            <p 
                              style={{color: 'rgb(0, 172, 0)' }}
                              className="produceDetails__star"
                            >
                                <Star fontSize="small" />
                            </p>
                            <p 
                              style={{color: 'rgb(0, 172, 0)' }}
                              className="produceDetails__star"
                            >
                                <Star fontSize="small" />
                            </p>
                            <p 
                              style={{color: 'rgb(0, 172, 0)' }}
                              className="produceDetails__star"
                            >
                                <Star fontSize="small" />
                            </p>
                            <p 
                              style={{color: 'rgb(0, 172, 0)' }}
                              className="produceDetails__star"
                            >
                                <Star fontSize="small" />
                            </p>
                            <p 
                              style={{color: 'rgb(0, 172, 0)' }}
                              className="produceDetails__star"
                            >
                                <Star fontSize="small" />
                            </p>
                        </div>
                    </div>
                    <div className="produceDetails__reviewNote">
                        Curabitur vel cursus leo. Sed volutpat et odio ut malesuada. Vivamus posuere vestibulum mauris ac dapibus. Quisque nec elementum eros. Proin imperdiet, arcu ut varius cursus, purus turpis lobortis est, quis ultricies quam ligula vitae mauris. Aliquam ac lectus in ante imperdiet imperdiet.
                    </div>
                    <div className="produceDetails__reviewName">
                        ~ sit amet
                    </div>
                    <div className="produceDetails__topRating">
                        <div className="produceDetails__topStar">
                            <p 
                              style={{color: 'rgb(0, 172, 0)' }}
                              className="produceDetails__star"
                            >
                                <Star fontSize="small" />
                            </p>
                            <p 
                              style={{color: 'rgb(0, 172, 0)' }}
                              className="produceDetails__star"
                            >
                                <Star fontSize="small" />
                            </p>
                            <p 
                              style={{color: 'rgb(0, 172, 0)' }}
                              className="produceDetails__star"
                            >
                                <Star fontSize="small" />
                            </p>
                            <p className="produceDetails__star">
                                <Star fontSize="small" />
                            </p>
                            <p className="produceDetails__star">
                                <Star fontSize="small" />
                            </p>
                        </div>
                    </div>
                    <div className="produceDetails__reviewNote">
                        Morbi ac ante quis mi fringilla tincidunt ac at libero. Donec vulputate lectus non gravida dignissim. Nullam feugiat ultrices mi non venenatis. Vivamus fermentum pharetra dictum. Duis mi lectus, facilisis at euismod nec, elementum et erat. Sed at consectetur risus, id convallis arcu.
                    </div>
                    <div className="produceDetails__reviewName">
                        ~ pellentesque felis
                    </div>
                </div>
                }
            </div>
        </div>

        {displayImage &&
          <div className="produceDetails__fullImage">
            <div className="produceDetails__imageCancel">
                <IconButton onClick={() => setDisplayImage(false)}>
                    <Cancel style={{color: 'rgb(0, 172, 0)', fontSize: windowWidth < 808 ? '20px' : '32px'}} />
                </IconButton>
            </div>
            <div className="produceDetails__imageComponents">
                <img 
                  src={produceDetails.image} 
                  alt="" 
                />
            </div>
          </div>
        }
        </>
    )
}

export default ProduceDetails
