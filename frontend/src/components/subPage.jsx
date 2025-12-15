'use client'
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Image from "next/image";
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Sitemap from '../components/Sitemap';
import { Toast } from '../components/Toast/index.jsx';

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
function SubPage({page}) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        getPageData()
        axios({
            method: 'get',
            url: `${baseurl}/healthz`,
        }).then(async (response) => {
            console.log('Healthz response:', response.data);
            Toast({ message: `version: ${response.data.version}` })
        }).catch((err)=>{
            console.error('Healthz error:', err);
        })
    },[])
    const getPageData = (id)=>{
        let config = {
            method: 'get',
            url: `${baseurl}/api/get-page-data`,
        };
        const toastInst = Toast({ type: 'loading', message: 'Loading...' });
        setLoading(true)
        axios(config)
            .then(async (response) => {
                let tmp_data = {}
                console.log(response.data)
                response.data.settings.forEach(element => {

                    tmp_data = {...tmp_data, [element.key]:element.value}
                });
                if(page=="specified")
                {
                    setTitle(tmp_data["specified-title"])
                    setContent(tmp_data["specified-description"])
                }
                if(page=="personal"){
                    setTitle(tmp_data["protected-title"])
                    setContent(tmp_data["protected-description"])
                }
                if(page=="privacy"){
                    setTitle(tmp_data["privacy-title"])
                    setContent(tmp_data["privacy-title"])
                }
                toastInst.close()
            })
            .catch((err)=>{
                toastInst.close()
                Toast({ type: 'error', message: err.message || 'Something went wrong' })
            }).finally(()=>{
                setLoading(false)
            })
    }

    return(
        <>
            <Header/>
            <div className="product">
                <section className="top">
                    <div className="top-img">
                        <Image
                          width={100}
                          height={100} src="/assets/images/top-img.png" alt=""/>
                        <Image
                          width={100}
                          height={100} src="/assets/images/top-img02.png" className="sp" alt=""/>
                    </div>
                    <img src="/assets/images/logo.svg" className="top-logo-img" alt=""/>
                    <p className="top-text1">ロイヤルジャパン<br/>公式オンラインショッピング</p>
                    <p className="top-text2">愛の証を超濃厚に、超濃密に</p>
                    <p className="top-text3">ふたりだけの夜をもっと愉しむために</p>
                </section>

                <section className="list">
                    <div className="sub-page-title">
                        {title}
                    </div>
                    {loading ? <p style={{textAlign: 'center'}}>Loading...</p> :
                        content ? <div className="contain">
                            <div style={{display:"flex"}}>
                                <p>{content}</p>
                            </div>
                        </div>
                    : <p style={{textAlign: 'center'}}>No Data Available</p>
                    }
                </section>
            </div>
            <Sitemap/>

        </>
    )
}
export default SubPage;