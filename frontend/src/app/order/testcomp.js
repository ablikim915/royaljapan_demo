'use client'
// import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
// import {loadStripe} from "@stripe/stripe-js/pure";
// const stripePromise = loadStripe('pk_test_51PvaMkKQfMI1g1n87ugCQsYOo89kYseL4FdkLHSaajuNu1nCrcSJJE0nWoxEDkbQp3wo8m8meUn0NlIfbhUv07YG00Lp2SEk4U');
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sitemap from '../../components/Sitemap';
import Detail from '../../components/Detail';
import axios from 'axios';
import {useParams, useSearchParams} from "next/navigation";
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;



function Order({}) {

    const searchParams = useSearchParams();

    // const [searchParams, setSearchParams] = useSearchParams();
    let searchParamCount = searchParams?.get("count")
    const [count, setCount] = useState(searchParamCount);
    // const [trigger, setTrigger] = useState(0);
    const {user_id, product_id, coupon } = useParams()
    const [tab, setTab] = useState(1)
    const [name, setName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    // const [option, setOption] = useState({})
    const [price, setPrice] = useState(0);
    const handleClick = async () =>{
        if(tab==1){

            if(name=="" || email==""){
                return
            }
            // else{
            //     localStorage.setItem("customerData", JSON.stringify({
            //         count:count,
            //         name:name,
            //         email:email,
            //         phone:phone,
            //         address:address,
            //         address1:address1
            //     }))
            // }
            setTab(2)
        }
        if(tab==2){
            setTab(3)
            // setTrigger(trigger + 1)
            // if (!stripe || !elements) {
            //     return;
            // }
            // const cardNumberElement = elements.getElement(CardNumberElement);
            // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            //     payment_method: {
            //         card: cardNumberElement,
            //         billing_details: {
            //             name: name,
            //             email: email
            //         }
            //     }
            // })
            // if(paymentIntent.status=="succeeded")
            // {
            //     setTab(3)
            let data = JSON.stringify({
                "product":product_id,
                'user':user_id,
                'coupon':coupon ? coupon : "",
                'count':count,
                'email':email,
                'name':name,
                'phone':phone,
                'address':address,
                'address1':address1
            });
            let config = {
                method: 'post',
                url: `${baseurl}/api/sold`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data : data,
            };
            axios(config)
                .then(async (response) => {

                })
                .catch((err)=>{
                })
            // }
        }
    }

    // const createPaymentIntent =  (priceId) => {
    //     let data = JSON.stringify({
    //         "product":product_id,
    //         'coupon':coupon ? coupon : "",
    //         'count':count
    //     });
    //     let config = {
    //         method: 'post',
    //         url: `${baseurl}/api/create-payment-intent`,
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         data : data
    //     };
    //     axios(config)
    //     .then(async (response) => {
    //         setOption({...option, clientSecret:response.data.clientSecret})
    //         setTab(2)
    //     })
    //     .catch((err)=>{
    //     })
    // };

    // useEffect(() => {
    //     const clientSecret = new URLSearchParams(window.location.search).get(
    //         'payment_intent_client_secret'
    //     );
    //     const redirect_status = new URLSearchParams(window.location.search).get(
    //         'redirect_status'
    //     );
    //     if(redirect_status=="succeeded"){

    //         var customer_data =  JSON.parse(localStorage.getItem("customerData")) || null;
    //         if(customer_data){
    //             setCount(customer_data.count)
    //             let data = JSON.stringify({
    //                 "product":product_id,
    //                 'user':user_id,
    //                 'coupon':coupon ? coupon : "",
    //                 "name":customer_data.name,
    //                 "email":customer_data.email,
    //                 'count':customer_data.count,
    //                 "phone":customer_data.phone,
    //                 "address":customer_data.address,
    //                 "address1":customer_data.address1,
    //             });
    //             let config = {
    //                 method: 'post',
    //                 url: `${baseurl}/api/sold`,
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                     data : data,
    //             };
    //             axios(config)
    //             .then(async (response) => {
    //                 setTab(3)
    //             })
    //             .catch((err)=>{
    //             })
    //         }
    //     }

    // },[])

    return(
        <>
            <Header/>
            <div className="product" id="order">
                <section className="top pc">
                    <div className="top-img">
                        <img src="/assets/images/top-img.png" alt=""/>
                        <img src="/assets/images/top-img02.png" className="sp" alt=""/>
                    </div>
                    <img src="/assets/images/logo.svg" alt=""/>
                    <p className="top-text1">ロイヤルジャパン<br/>公式オンラインショッピング</p>
                    <p className="top-text2">愛の証を超濃厚に、超濃密に</p>
                    <p className="top-text3">ふたりだけの夜をもっと愉しむために</p>
                </section>
                <section className="order">
                    <div className="contain">
                        {tab!==3 && <Detail id={product_id} coupon={coupon} user={user_id} count={count} setPrice={setPrice}/>}
                        <div className="order-form">
                            {tab==1 && <div className="form-notice">お客様の情報をご入力ください。</div>}
                            <div className="form-step">
                                <div className={`form-step-part ${tab==1?"active":""}`}>
                                    <div className="form-step-part-number">
                                        1
                                    </div>
                                    <div className="form-step-part-title">
                                        お客様情報入力
                                    </div>
                                </div>
                                <div className={`form-step-part ${tab==2?"active":""}`}>
                                    <div className="form-step-part-number">
                                        2
                                    </div>
                                    <div className="form-step-part-title">
                                        ご注文内容のご確認
                                    </div>
                                </div>
                                <div className={`form-step-part ${tab==3?"active":""}`}>
                                    <div className="form-step-part-number">
                                        3
                                    </div>
                                    <div className="form-step-part-title">
                                        完了
                                    </div>
                                </div>
                            </div>

                            {tab==1&&<div className="form-group">
                                <div className="form-input">
                                    <div className="label">お名前</div>
                                    <div className="input">
                                        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" name="name" placeholder="Yamaha Taro"/>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <div className="label">発送先の住所</div>
                                    <div className="input">
                                        <input value={address1} onChange={(e)=>setAddress1(e.target.value)} type="text" name="order-address" placeholder="住所"/>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <div className="label">住所</div>
                                    <div className="input">
                                        <input value={address} onChange={(e)=>setAddress(e.target.value)} type="text" name="address" placeholder="住所"/>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <div className="label">電話番号</div>
                                    <div className="input">
                                        <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="text" name="phone" placeholder="xxxxxxxxx"/>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <div className="label">メールアドレス</div>
                                    <div className="input">
                                        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" name="email" placeholder="xxx@xxx.com"/>
                                    </div>
                                </div>
                            </div>}
                            {tab==2&&
                                <div className='card-container'>
                                    <div className="form-group">
                                        <div className="form-input">
                                            <div className="label">振込先銀行</div>
                                            <div className="input">
                                                住信SBIネット銀行
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label">支店名</div>
                                            <div className="input">
                                                イチゴ支店（１０１）
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label">口座番号</div>
                                            <div className="input">
                                                3981445
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label">振込先名義</div>
                                            <div className="input">
                                                キムラ　シンジ
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label">振込金額</div>
                                            <div className="input">
                                                {parseInt(price).toLocaleString('en-US').toString()}円

                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label"></div>
                                            <div className="input">
                                                <div style={{fontSize:"12px", color:"red"}}>
                                                    ※振込人名義は必ず、発送先の方のお名前と同じ名前でお振込ください。
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {tab==3&&
                                <>
                                    <div className="card-container order-complete">
                                        <div>
                                            <div className='text'>下記の注文情報で承りました。</div>
                                            <div className='text red'>入金の確認が取れ次第商品を発送いたします。</div>
                                            <div className='text'>
                                                商品の発送が完了しましたら、ご入力いただいたメール宛に発送情報を送付いたします。
                                            </div>
                                            <div className='text'>商品の到着予定：２〜４週間</div>

                                            <div className='text red'>必ず、【お客様サポート専用ライン】を追加して下さい。</div>
                                        </div>
                                        <div className="detail-right">
                                            <div>
                                                <div className='text'>【お客様サポート専用ライン】</div>
                                                <div className='text'>
                                                    誤って情報を入力した場合など
                                                </div>
                                                <div className='text'>
                                                    こちらからお問い合わせ下さい。
                                                </div>
                                                <img src="/assets/images/line1.png"/>
                                            </div>
                                            <div className='qr'>
                                                <img src="/assets/images/QR.png"/>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='card-container order-complete'>
                                        <div className="form-group">
                                            <div className="label" style={{paddingLeft:"20px", marginBottom:"20px", fontSize:"15px"}}> 【注文情報】</div>
                                            <div className="form-input">
                                                <div className="label">発送先のお名前</div>
                                                <div className="input">
                                                    {name}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">発送先の住所</div>
                                                <div className="input">
                                                    {address1}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">住所</div>
                                                <div className="input">
                                                    {address}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">電話番号</div>
                                                <div className="input">
                                                    {phone}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">メールアドレス</div>
                                                <div className="input">
                                                    {email}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">

                                            <div className="label" style={{paddingLeft:"20px", marginBottom:"20px", fontSize:"15px"}}> 【支払い情報】</div>

                                            <div className="form-input">
                                                <div className="label">振込先銀行</div>
                                                <div className="input">
                                                    住信SBIネット銀行
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">支店名</div>
                                                <div className="input">
                                                    イチゴ支店（１０１）
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">口座番号</div>
                                                <div className="input">
                                                    3981445
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">振込先名義</div>
                                                <div className="input">
                                                    キムラ　シンジ
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">振込金額</div>
                                                <div className="input">
                                                    {parseInt(price).toLocaleString('en-US').toString()}円

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </>
                            }
                            {tab!==3&& <button onClick={handleClick} className="form-btn"><p>{tab==1?"次へ" : "支払い完了"}</p><span></span></button>}
                        </div>
                    </div>
                </section>
            </div>
            <Footer/>
            <Sitemap/>
        </>
    )
}

// const CheckoutForm = ({trigger, user_id, product_id, coupon, count}) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [errorMessage, setErrorMessage] = useState(null);
//     useEffect(()=>{
//         if(trigger!=0){
//             handleSubmit()
//         }
//     },[trigger])

//     const handleSubmit = async () =>{
//         let coupon_code = ""
//         if(coupon)
//             coupon_code = coupon
//         if (!stripe || !elements) {
//             return;
//         }
//         const {error} = await stripe.confirmPayment({
//         //`Elements` instance that was used to create the Payment Element
//         elements,
//         confirmParams: {
//             return_url: `${mainurl}/order/${user_id}/${product_id}/${coupon_code}`,
//         },
//         });
//         if (error) {
//             // This point will only be reached if there is an immediate error when
//             // confirming the payment. Show error to your customer (for example, payment
//             // details incomplete)
//             setErrorMessage(error.message);
//           } else {
//             // Your customer will be redirected to your `return_url`. For some payment
//             // methods like iDEAL, your customer will be redirected to an intermediate
//             // site first to authorize the payment, then redirected to the `return_url`.
//           }

//     }
//     return (
//         <PaymentElement />
//     );
// };

export default Order;