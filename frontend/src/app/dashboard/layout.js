"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import ProductSetting from "@/components/ProductSetting";
import PageSetting from "@/components/PageSetting";
import Home from "@/components/Home";
import Link from "next/link";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Layout({ children }) {
  const pathname = usePathname();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let parsedUserData =
      JSON.parse(window.localStorage?.getItem("userData")) || null;

    if (parsedUserData) {
      setUserData(parsedUserData);
    } else router.push("/login");
  }, []);

  const router = useRouter();

  const [userid, setUserID] = useState("");
  const [username, setUserName] = useState("");
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [sellCount, setSellCount] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    var userData = JSON.parse(localStorage.getItem("userData")) || null;
    var token = userData?.token;
    let config = {
      method: "get",
      url: `${baseurl}/api/get-user-data`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then((response) => {
        setUserName(response.data.name);
        setUserID(response.data.id);
        setProducts(response.data.products);
        setCoupons([]);
        setCoupons(response.data.coupons);

        if (response.data.products.length > 0) {
          let productslist = response.data.products;
          let sellcount_tmp = 0;
          let profit_tmp = 0;

          productslist.forEach((p) => {
            sellcount_tmp += p.sold_count;
            profit_tmp += p.sold_count * (p.price_sell - p.price_origin);
          });
          setProfit(profit_tmp);
          setSellCount(sellcount_tmp);
        }
      })
      .catch((err) => {
        // setError(true);
        // setErrorMsg("ユーザーが見つかりません。");
        if (err.response.status == 401) {
          localStorage.clear();
          window.location.assign("/login");
        }
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.assign("/login");
  };

  return (
    <div id="home" className="home">
      <aside>
        <div className="home-logo">
          <div className="register-title">
            <img src="/assets/images/logo.svg" alt="" />
            <h2>
              海外サプリメント個人輸入
              <br />
              <strong>紹介者専用サイト</strong>
            </h2>
          </div>
        </div>
        <div className="home-info">
          <div className="info-name">
            <p>名前：</p>
            <p>{username}</p>
          </div>
          <div className="info-name">
            <p>販売リンク：</p>
            <p>{`https://royaljapan.asia/${userid}`}</p>
          </div>
        </div>
        <Link href="/dashboard" className="home-btn">
          <img src="/assets/images/home.svg" alt="" />
          <p>ホーム</p>
        </Link>
        <Link href="/dashboard/product-stting" className="home-btn">
          <img src="/assets/images/package.svg" alt="" />
          <p>商品編集</p>
        </Link>
        <Link href="/dashboard/page-stting" className="home-btn">
          <img src="/assets/images/file-text.svg" alt="" />
          <p>編集可能ページ</p>
        </Link>
        <Link href="" className="home-btn">
          <img src="/assets/images/settings.svg" alt="" />
          <p>設定</p>
        </Link>
        <p className="update-info">
          動作保証環境はPCのGoogle Chrome（最新版）となります。
          <br />
          更新：JP 2024.2.27
        </p>
      </aside>
      <main>
        <div className="head">
          <a href="#" className="breadcrumb">
            <img src="/assets/images/home-white.svg" alt="" />
            <p>ホーム</p>
          </a>
          <div onClick={handleLogout} href="#" id="logout" className="logout">
            ログアウト ▼
          </div>
        </div>
        {pathname.includes("/product-stting") ? (
          <ProductSetting products={products} />
        ) : pathname.includes("/product-stting") ? (
          <ProductSetting products={products} />
        ) : (
          <Home
            userid={userid}
            username={username}
            products={products}
            sellCount={sellCount}
            profit={profit}
            coupons={coupons}
          />
        )}
      </main>
    </div>
  );
}
