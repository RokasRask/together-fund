import sliderImg from '../Style/Template/images/slider-img.png';
import aboutImg from '../Style/Template/images/about-img.png';
import autoImg from '../Style/Template/images/auto-img.png';
import client1 from '../Style/Template/images/client-1.jpg';
import client2 from '../Style/Template/images/client-2.jpg';
import icon1 from '../Style/Template/images/icon1.png';
import icon2 from '../Style/Template/images/icon2.png';
import icon3 from '../Style/Template/images/icon3.png';
import icon4 from '../Style/Template/images/icon4.png';
import appStore from '../Style/Template/images/app-store.png';
import playStore from '../Style/Template/images/play-store.png';
import Link from '../Components/Link';

export default function Home() {
    return (
        <div>
            {/* Hero Section */}
            <div className="hero_area">
                {/* Slider Section */}
                <section className="slider_section position-relative">
                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        {/* <ol className="carousel-indicators">
                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
                        </ol> */}
                        <div className="carousel-inner">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <div className="container">
                                        <div className="box">
                                            <div className="row">
                                                <div className="col-md-7">
                                                    <div className="detail-box">
                                                        <div>
                                                            <h1>TogetherFund</h1>
                                                            <h2>Kartu mes galime daugiau.</h2>
                                                            <div>
                                                                <Link to="create_idea">Pradėti</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="img-box">
                                                        <img src={sliderImg} alt="Slider" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* End Slider Section */}
            </div>

            {/* How Section */}
            <section className="how_section layout_padding">
                <div className="heading_container">
                    <h2>Kaip tai veikia?</h2>
                </div>
                <div className="how_container">
                    {[
                        { title: 'Sukurkite istoriją', icon: icon1, text: 'Pasidalinkite savo idėja ar projektu su bendruomene. Įkelkite nuotrauką ir nurodykite reikalingą sumą.' },
                        { title: 'Pasiekite žmones', icon: icon2, text: 'Jūsų istorija pasieks žmones, kurie domisi ir nori prisidėti prie jūsų idėjos įgyvendinimo.' },
                        { title: 'Surinkite lėšas', icon: icon3, text: 'Stebėkite, kaip auga jūsų surenkama suma. Kiekvienas indėlis artina jus prie tikslo.' },
                        { title: 'Įgyvendinkite', icon: icon4, text: 'Surinkę reikiamą sumą, galėsite įgyvendinti savo idėją. TogetherFund padės jums pasiekti tikslą.' },
                    ].map((item, index) => (
                        <div key={index} className="box">
                            <div className="img-box">
                                <img src={item.icon} alt="" />
                            </div>
                            <div className="detail-box">
                                <h5>{item.title}</h5>
                                <p>{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="btn-box">
                    <a href="">Sužinoti daugiau</a>
                </div>
            </section>
            {/* End How Section */}

            {/* About Section */}
            <section className="about_section layout_padding-bottom">
                <div className="container">
                    <div className="heading_container">
                        <h2>Apie TogetherFund</h2>
                    </div>
                    <div className="box">
                        <div className="img-box">
                            <img src={aboutImg} alt="About" />
                        </div>
                        <div className="detail-box">
                            <p>
                                TogetherFund yra platforma, kurioje lietuviai gali dalintis savo istorijomis ir idėjomis
                                bei ieškoti finansinės paramos jų įgyvendinimui. Mūsų tikslas – sujungti kūrėjus, 
                                svajotojus ir rėmėjus vienoje vietoje, kad kartu galėtume sukurti kažką ypatingo.
                                Nesvarbu, ar reikia lėšų jūsų verslui, kūrybiniam projektui, ar asmeninei idėjai – 
                                čia jūs galite rasti žmonių, kurie patikės jūsų vizija.
                            </p>
                            <div className="btn-box">
                                <a href="">Skaityti daugiau</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End About Section */}

            {/* App Section */}
            <section className="app_section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="detail-box">
                                <h2>Mūsų mobilioji programėlė</h2>
                                <p>
                                    Naudokitės TogetherFund bet kur ir bet kada su mūsų mobiliąja programėle. 
                                    Sekite remiamus projektus, gaukite pranešimus apie naujas aukas ir valdykite 
                                    savo istoriją tiesiog iš savo telefono.
                                </p>
                                <div className="download_box">
                                    <h5>Atsisiųskite dabar</h5>
                                    <div className="btn-box">
                                        <a href="">
                                            <img src={appStore} alt="App Store" />
                                        </a>
                                        <a href="">
                                            <img src={playStore} alt="Play Store" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="img-box">
                                <img src={sliderImg} alt="App" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End App Section */}

            {/* Auto Section */}
            <section className="auto_section layout_padding">
                <div className="container">
                    <div className="heading_container">
                        <h2>Pradėkite savo istoriją dabar</h2>
                    </div>
                    <div className="box">
                        <div className="img-box">
                            <img src={autoImg} alt="Auto" />
                        </div>
                        <div className="detail-box">
                            <p>
                                Sukurkite savo istoriją ar idėją jau šiandien. Procesas yra paprastas ir greitas – 
                                tiesiog užpildykite formą, įkelkite nuotrauką ir nurodykite reikiamą sumą. 
                                Mūsų komanda peržiūrės jūsų paraišką ir, ją patvirtinus, jūsų istorija taps 
                                matoma tūkstančiams potencialių rėmėjų. Nesvarbu, ar tai verslo idėja, 
                                labdaros projektas, ar asmeninis tikslas – TogetherFund platforma jums padės.
                            </p>
                            <div className="btn-box">
                            <Link to='register'>Registruotis dabar</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Auto Section */}

            {/* Client Section */}
            <section className="client_section layout_padding-bottom">
                <div className="container">
                    <div className="heading_container">
                        <h2>Sėkmės istorijos</h2>
                    </div>
                    {[
                        { name: 'Tomas Petrauskas', role: 'Verslo pradžia', image: client1, text: 'Dėka TogetherFund platformos man pavyko surinkti pradinį kapitalą savo kepyklėlei. Procesas buvo paprastas, o bendruomenės palaikymas – neįtikėtinas. Per mėnesį surinkau visą reikalingą sumą ir dabar mano verslas klesti!' },
                        { name: 'Kazys Kazlauskas', role: 'Labdaros projektas', image: client2, text: 'Norėjome suburti lėšas benamių gyvūnų prieglaudai, ir TogetherFund mums padėjo tai padaryti. Surinkome net daugiau nei tikėjomės, o platforma buvo labai patogi naudoti. Dabar galime padėti dvigubai daugiau gyvūnų!' },
                    ].map((client, index) => (
                        <div key={index} className="box">
                            <div className="client_id">
                                <div className="img-box">
                                    <img src={client.image} alt="" />
                                </div>
                                <div className="name">
                                    <h5>{client.name}</h5>
                                    <h6>{client.role}</h6>
                                </div>
                            </div>
                            <div className="client_detail">
                                <p>{client.text}</p>
                            </div>
                        </div>
                    ))}
                    <div className="btn-box">
                        <Link to='all_ideas'>Daugiau istorijų</Link>
                    </div>
                </div>
            </section>
            {/* End Client Section */}
            <section className="info_section layout_padding">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="info_contact">
                                <div className="info_logo">
                                    <a href="index.html">
                                        <span>TogetherFund</span>
                                    </a>
                                </div>
                                <h5>Susisiekite su mumis</h5>
                                <div>
                                    <div className="img-box">
                                        <img src="images/location.png" width="18px" alt="" />
                                    </div>
                                    <p>Vilniaus g. 123, Vilnius</p>
                                </div>
                                <div>
                                    <div className="img-box">
                                        <img src="images/phone.png" width="18px" alt="" />
                                    </div>
                                    <p>+370 612 34567</p>
                                </div>
                                <div>
                                    <div className="img-box">
                                        <img src="images/envelope.png" width="18px" alt="" />
                                    </div>
                                    <p>info@togetherfund.lt</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="info_info">
                                <h5>Apie platformą</h5>
                                <p>
                                    TogetherFund yra patikima grupinio finansavimo platforma, padedanti lietuviams įgyvendinti savo idėjas ir projektus. 
                                    Mūsų misija – suteikti galimybę kiekvienam pasidalinti savo istorija ir rasti rėmėjų.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="info_links">
                                <h5>Naudingos nuorodos</h5>
                                <ul>
                                    <li><a href="">Pagrindinis</a></li>
                                    <li><a href="">Apie mus</a></li>
                                    <li><a href="">Projektai</a></li>
                                    <li><a href="">Sukurti istoriją</a></li>
                                    <li><a href="">Pagalba</a></li>
                                    <li><a href="">Privatumo politika</a></li>
                                    <li><a href="">Kontaktai</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="info_form">
                                <h5>Naujienlaiškis</h5>
                                <form action="">
                                    <input type="email" placeholder="Įveskite savo el. paštą" />
                                    <button>Prenumeruoti</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}