import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import { BottomNav } from "../components/bottom-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import {
  ArrowLeft,
  TrendingUp,
  Bitcoin,
  Building2,
  Rocket,
  Sprout,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  FileText,
  Users,
  DollarSign,
  Banknote,
  Heart,
  BarChart3,
  Gem,
  Search,
  Star,
  Wallet,
  Info,
  Shield,
  Clock,
  Minus,
  Plus,
  CheckCircle2,
  PartyPopper,
  type LucideIcon
} from "lucide-react";

interface AssetItem {
  id: string;
  name: string;
  ticker: string;
  price: string;
  change: string;
  changePercent: string;
  positive: boolean;
  marketCap?: string;
  volume?: string;
  about: string;
  chartData: number[];
  tags: string[];
}

interface CategoryConfig {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  iconColor: string;
  assets: AssetItem[];
}

const categories: Record<string, CategoryConfig> = {
  stocks: {
    name: "Stocks",
    icon: TrendingUp,
    color: "bg-blue-500",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    assets: [
      { id: "dangcem", name: "Dangote Cement", ticker: "DANGCEM", price: "₦290.50", change: "+₦5.20", changePercent: "+1.82%", positive: true, marketCap: "₦4.95T", volume: "₦1.2B", about: "Dangote Cement Plc is Africa's largest cement producer, operating across 10 African countries. The company was founded by Aliko Dangote and is listed on the Nigerian Stock Exchange. It produces and distributes cement products throughout Sub-Saharan Africa.", chartData: [260, 265, 258, 270, 275, 268, 280, 285, 278, 290, 285, 290], tags: ["Manufacturing", "Large Cap"] },
      { id: "gtco", name: "Guaranty Trust Holding", ticker: "GTCO", price: "₦44.85", change: "+₦1.15", changePercent: "+2.63%", positive: true, marketCap: "₦1.32T", volume: "₦850M", about: "Guaranty Trust Holding Company (GTCO) is a leading financial services group in Africa. Through its subsidiary, Guaranty Trust Bank, it provides banking, payments, and financial technology solutions across Nigeria, West Africa, East Africa, and the United Kingdom.", chartData: [38, 39, 41, 40, 42, 43, 41, 44, 43, 45, 44, 45], tags: ["Banking", "Large Cap"] },
      { id: "airtelaf", name: "Airtel Africa", ticker: "AIRTELAF", price: "₦2,105.00", change: "+₦45.00", changePercent: "+2.18%", positive: true, marketCap: "₦7.92T", volume: "₦620M", about: "Airtel Africa is a leading provider of telecommunications and mobile money services across 14 countries in Africa. The company serves over 150 million customers and has become a major player in mobile financial services through Airtel Money.", chartData: [1950, 1980, 2000, 2020, 2050, 2030, 2060, 2080, 2070, 2100, 2090, 2105], tags: ["Telecoms", "Large Cap"] },
      { id: "buacement", name: "BUA Cement", ticker: "BUACEMENT", price: "₦70.25", change: "-₦1.50", changePercent: "-2.09%", positive: false, marketCap: "₦2.38T", volume: "₦450M", about: "BUA Cement Plc is one of the largest cement companies in Nigeria, with a production capacity of over 11 million tonnes per annum. The company operates cement plants across multiple locations in Nigeria.", chartData: [75, 74, 73, 72, 74, 73, 71, 72, 71, 70, 71, 70], tags: ["Manufacturing", "Large Cap"] },
      { id: "zenithbank", name: "Zenith Bank", ticker: "ZENITHBANK", price: "₦36.90", change: "+₦0.80", changePercent: "+2.22%", positive: true, marketCap: "₦1.16T", volume: "₦780M", about: "Zenith Bank Plc is one of Nigeria's largest banks by tier-1 capital. It provides a wide range of corporate and retail banking, treasury, trade finance, and wealth management services.", chartData: [33, 34, 35, 34, 36, 35, 37, 36, 38, 37, 37, 37], tags: ["Banking", "Large Cap"] },
      { id: "mtnn", name: "MTN Nigeria", ticker: "MTNN", price: "₦195.40", change: "-₦3.20", changePercent: "-1.61%", positive: false, marketCap: "₦3.98T", volume: "₦920M", about: "MTN Nigeria Communications Plc is the largest mobile telecommunications operator in Nigeria with over 80 million subscribers. It provides voice, data, fintech, and enterprise services.", chartData: [205, 202, 200, 198, 201, 199, 197, 198, 196, 195, 196, 195], tags: ["Telecoms", "Large Cap"] },
      { id: "nestle", name: "Nestle Nigeria", ticker: "NESTLE", price: "₦780.00", change: "+₦12.00", changePercent: "+1.56%", positive: true, marketCap: "₦618B", volume: "₦210M", about: "Nestle Nigeria Plc manufactures and markets food products and beverages in Nigeria. Its brands include Maggi, Milo, Golden Morn, and Nestle Pure Life water.", chartData: [740, 745, 750, 755, 760, 758, 765, 770, 768, 775, 778, 780], tags: ["Consumer Goods", "Mid Cap"] },
      { id: "seplat", name: "Seplat Energy", ticker: "SEPLAT", price: "₦3,450.00", change: "+₦85.00", changePercent: "+2.53%", positive: true, marketCap: "₦2.03T", volume: "₦380M", about: "Seplat Energy Plc is a leading Nigerian independent energy company focused on oil and gas exploration and production. The company operates several oil mining leases in the Niger Delta region.", chartData: [3200, 3250, 3300, 3280, 3350, 3380, 3360, 3400, 3420, 3450, 3430, 3450], tags: ["Oil & Gas", "Large Cap"] },
    ]
  },
  crypto: {
    name: "Crypto",
    icon: Bitcoin,
    color: "bg-orange-500",
    bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    assets: [
      { id: "btc", name: "Bitcoin", ticker: "BTC", price: "₦152,400,000", change: "+₦3,800,000", changePercent: "+2.56%", positive: true, marketCap: "$1.92T", volume: "$48B", about: "Bitcoin is the first and most well-known cryptocurrency, created in 2009 by Satoshi Nakamoto. It operates on a decentralized peer-to-peer network using blockchain technology. Bitcoin is often called 'digital gold' due to its limited supply of 21 million coins.", chartData: [140, 142, 145, 143, 148, 146, 150, 149, 151, 153, 152, 152], tags: ["Layer 1", "Store of Value"] },
      { id: "eth", name: "Ethereum", ticker: "ETH", price: "₦5,720,000", change: "+₦180,000", changePercent: "+3.25%", positive: true, marketCap: "$380B", volume: "$22B", about: "Ethereum is a decentralized platform that enables smart contracts and decentralized applications (dApps). Created by Vitalik Buterin, it introduced programmable blockchain technology and powers the majority of DeFi protocols and NFT marketplaces.", chartData: [5200, 5300, 5400, 5350, 5500, 5450, 5600, 5550, 5650, 5700, 5680, 5720], tags: ["Layer 1", "Smart Contracts"] },
      { id: "sol", name: "Solana", ticker: "SOL", price: "₦320,500", change: "+₦15,200", changePercent: "+4.98%", positive: true, marketCap: "$82B", volume: "$8.5B", about: "Solana is a high-performance blockchain platform known for its speed and low transaction costs. It uses a unique Proof of History consensus mechanism and can process thousands of transactions per second, making it popular for DeFi, NFTs, and gaming.", chartData: [280, 285, 290, 295, 300, 298, 305, 310, 308, 315, 318, 320], tags: ["Layer 1", "High Speed"] },
      { id: "xrp", name: "XRP", ticker: "XRP", price: "₦3,850", change: "-₦120", changePercent: "-3.02%", positive: false, marketCap: "$135B", volume: "$5.2B", about: "XRP is the native cryptocurrency of the XRP Ledger, designed for fast and efficient cross-border payments. Created by Ripple Labs, XRP settles transactions in 3-5 seconds and is used by financial institutions worldwide for international money transfers.", chartData: [4100, 4050, 4000, 3980, 3950, 3920, 3900, 3880, 3870, 3860, 3850, 3850], tags: ["Payments", "Cross-Border"] },
      { id: "bnb", name: "BNB", ticker: "BNB", price: "₦1,140,000", change: "+₦28,000", changePercent: "+2.52%", positive: true, marketCap: "$95B", volume: "$3.8B", about: "BNB is the native token of the BNB Chain ecosystem, originally created as Binance Coin for the Binance exchange. It powers the BNB Smart Chain which hosts thousands of decentralized applications and is widely used for trading fee discounts.", chartData: [1050, 1060, 1080, 1070, 1090, 1100, 1095, 1110, 1120, 1130, 1135, 1140], tags: ["Exchange", "Layer 1"] },
      { id: "ada", name: "Cardano", ticker: "ADA", price: "₦1,520", change: "+₦85", changePercent: "+5.92%", positive: true, marketCap: "$28B", volume: "$1.8B", about: "Cardano is a proof-of-stake blockchain platform that aims to provide a more balanced and sustainable ecosystem for cryptocurrencies. Founded by Charles Hoskinson, it takes a research-driven approach to development.", chartData: [1350, 1370, 1380, 1400, 1420, 1430, 1440, 1460, 1470, 1490, 1510, 1520], tags: ["Layer 1", "Research-Driven"] },
      { id: "doge", name: "Dogecoin", ticker: "DOGE", price: "₦540", change: "+₦32", changePercent: "+6.30%", positive: true, marketCap: "$24B", volume: "$4.1B", about: "Dogecoin started as a meme cryptocurrency in 2013 but has grown into a widely traded digital asset. It's known for its active community and has been endorsed by notable figures. Dogecoin uses a proof-of-work consensus mechanism.", chartData: [480, 490, 495, 500, 505, 510, 508, 515, 520, 530, 535, 540], tags: ["Meme", "Community"] },
      { id: "avax", name: "Avalanche", ticker: "AVAX", price: "₦68,500", change: "-₦2,100", changePercent: "-2.97%", positive: false, marketCap: "$14B", volume: "$1.2B", about: "Avalanche is a layer-1 blockchain platform that focuses on speed, low costs, and eco-friendliness. It uses a novel consensus protocol that enables near-instant transaction finality and supports the creation of custom blockchains.", chartData: [72000, 71500, 71000, 70500, 70000, 69500, 69800, 69200, 69000, 68800, 68600, 68500], tags: ["Layer 1", "Subnets"] },
    ]
  },
  "real-estate": {
    name: "Real Estate",
    icon: Building2,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    assets: [
      { id: "lekki-apt", name: "Lekki Phase 1 Apartments", ticker: "LEKKI-APT", price: "₦2,500/unit", change: "+₦120", changePercent: "+5.04%", positive: true, marketCap: "₦2.5B", volume: "₦180M", about: "Premium residential apartments in the heart of Lekki Phase 1, Lagos. This fractional investment gives you exposure to one of Lagos's most desirable neighborhoods with strong rental yields and capital appreciation.", chartData: [2200, 2250, 2280, 2300, 2320, 2350, 2380, 2400, 2420, 2450, 2470, 2500], tags: ["Residential", "Lagos"] },
      { id: "vi-office", name: "Victoria Island Office Space", ticker: "VI-OFFICE", price: "₦5,000/unit", change: "+₦200", changePercent: "+4.17%", positive: true, marketCap: "₦4.8B", volume: "₦250M", about: "Grade A commercial office space on Victoria Island, Lagos. Ideal for investors seeking stable rental income from corporate tenants in Nigeria's premier business district.", chartData: [4500, 4550, 4600, 4650, 4700, 4720, 4750, 4800, 4850, 4900, 4950, 5000], tags: ["Commercial", "Lagos"] },
      { id: "abuja-estate", name: "Abuja Residential Estate", ticker: "ABJ-RES", price: "₦3,200/unit", change: "+₦80", changePercent: "+2.56%", positive: true, marketCap: "₦1.8B", volume: "₦95M", about: "Gated residential estate development in Abuja's Maitama district. Features luxury homes targeting diplomats and senior government officials. Steady rental demand and growing capital values.", chartData: [2950, 2980, 3000, 3020, 3050, 3080, 3100, 3120, 3140, 3160, 3180, 3200], tags: ["Residential", "Abuja"] },
      { id: "ibeju-land", name: "Ibeju-Lekki Land Fund", ticker: "IBEJU-LF", price: "₦1,800/unit", change: "+₦350", changePercent: "+24.14%", positive: true, marketCap: "₦850M", volume: "₦120M", about: "Strategic land acquisition fund in the Ibeju-Lekki corridor, near the Dangote Refinery and Lekki Free Trade Zone. This area is experiencing rapid development and significant land value appreciation.", chartData: [1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1750, 1800], tags: ["Land", "Growth"] },
      { id: "ph-retail", name: "Port Harcourt Retail Mall", ticker: "PH-RETAIL", price: "₦4,100/unit", change: "-₦50", changePercent: "-1.20%", positive: false, marketCap: "₦1.2B", volume: "₦65M", about: "Fractional ownership in a modern retail mall in Port Harcourt. Anchored by major retailers with long-term lease agreements providing consistent rental income.", chartData: [4200, 4180, 4190, 4170, 4160, 4150, 4140, 4130, 4120, 4110, 4100, 4100], tags: ["Retail", "Port Harcourt"] },
    ]
  },
  "treasury-bills": {
    name: "Treasury Bills",
    icon: Landmark,
    color: "bg-sky-500",
    bgColor: "bg-sky-500/10 dark:bg-sky-500/20",
    iconColor: "text-sky-600 dark:text-sky-400",
    assets: [
      { id: "tbill-91", name: "91-Day Treasury Bill", ticker: "T-BILL 91D", price: "₦950/unit", change: "+₦2.50", changePercent: "+0.26%", positive: true, marketCap: "₦500B", volume: "₦45B", about: "Short-term government security with a 91-day maturity period. Issued at a discount and redeemed at face value. The most liquid and frequently traded T-Bill tenor.", chartData: [940, 942, 943, 944, 945, 946, 947, 948, 949, 950, 950, 950], tags: ["Short-term", "Low Risk"] },
      { id: "tbill-182", name: "182-Day Treasury Bill", ticker: "T-BILL 182D", price: "₦920/unit", change: "+₦3.00", changePercent: "+0.33%", positive: true, marketCap: "₦380B", volume: "₦32B", about: "Medium-term government security with a 182-day maturity. Offers slightly higher yields than the 91-day tenor while maintaining high liquidity and government backing.", chartData: [910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 920], tags: ["Medium-term", "Low Risk"] },
      { id: "tbill-364", name: "364-Day Treasury Bill", ticker: "T-BILL 364D", price: "₦880/unit", change: "+₦4.50", changePercent: "+0.51%", positive: true, marketCap: "₦420B", volume: "₦28B", about: "Long-term T-Bill with the highest yield among treasury bill tenors. One-year maturity provides better returns for investors willing to lock funds for a longer period.", chartData: [865, 867, 869, 871, 873, 874, 875, 876, 877, 878, 879, 880], tags: ["Long-term", "Low Risk"] },
    ]
  },
  "fgn-bonds": {
    name: "FGN Bonds",
    icon: Landmark,
    color: "bg-teal-600",
    bgColor: "bg-teal-600/10 dark:bg-teal-600/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    assets: [
      { id: "fgn-2yr", name: "FGN Bond 2-Year", ticker: "FGN 2YR", price: "₦985/unit", change: "+₦1.80", changePercent: "+0.18%", positive: true, marketCap: "₦800B", volume: "₦15B", about: "2-year Federal Government bond offering semi-annual coupon payments. Suitable for investors seeking stable returns with government backing over a short-to-medium period.", chartData: [978, 979, 980, 981, 982, 983, 984, 984, 985, 985, 985, 985], tags: ["Short-term", "Government"] },
      { id: "fgn-5yr", name: "FGN Bond 5-Year", ticker: "FGN 5YR", price: "₦960/unit", change: "+₦2.50", changePercent: "+0.26%", positive: true, marketCap: "₦1.2T", volume: "₦18B", about: "5-year Federal Government bond with competitive coupon rates. Balances yield with moderate duration risk. Semi-annual interest payments provide regular income.", chartData: [948, 950, 951, 953, 954, 955, 956, 957, 958, 959, 960, 960], tags: ["Medium-term", "Government"] },
      { id: "fgn-10yr", name: "FGN Bond 10-Year", ticker: "FGN 10YR", price: "₦940/unit", change: "+₦3.20", changePercent: "+0.34%", positive: true, marketCap: "₦1.5T", volume: "₦12B", about: "10-year benchmark government bond offering higher yields for longer commitment. The most actively traded long-dated FGN bond, used as a benchmark for other fixed income instruments.", chartData: [920, 922, 925, 927, 929, 931, 933, 935, 937, 938, 939, 940], tags: ["Long-term", "Benchmark"] },
    ]
  },
  "commercial-papers": {
    name: "Commercial Papers",
    icon: FileText,
    color: "bg-slate-600",
    bgColor: "bg-slate-600/10 dark:bg-slate-600/20",
    iconColor: "text-slate-600 dark:text-slate-400",
    assets: [
      { id: "dangote-cp", name: "Dangote Industries CP", ticker: "DANG-CP", price: "₦975/unit", change: "+₦1.50", changePercent: "+0.15%", positive: true, marketCap: "₦50B", volume: "₦8B", about: "Short-term debt instrument issued by Dangote Industries Limited. Backed by one of Africa's largest conglomerates with AAA local credit rating.", chartData: [968, 969, 970, 971, 972, 973, 973, 974, 974, 975, 975, 975], tags: ["Corporate", "AAA Rated"] },
      { id: "mtn-cp", name: "MTN Nigeria CP", ticker: "MTN-CP", price: "₦970/unit", change: "+₦2.00", changePercent: "+0.21%", positive: true, marketCap: "₦35B", volume: "₦5B", about: "Commercial paper issued by MTN Nigeria, the country's largest telecom operator. Strong credit profile backed by consistent revenue streams from over 80 million subscribers.", chartData: [962, 963, 964, 965, 966, 967, 968, 968, 969, 969, 970, 970], tags: ["Telecom", "AA+ Rated"] },
      { id: "access-cp", name: "Access Holdings CP", ticker: "ACCESS-CP", price: "₦965/unit", change: "+₦1.80", changePercent: "+0.19%", positive: true, marketCap: "₦28B", volume: "₦4B", about: "Commercial paper from Access Holdings, one of Nigeria's top-tier banking groups. Access Bank's strong balance sheet and pan-African presence support reliable debt servicing.", chartData: [958, 959, 960, 961, 961, 962, 963, 963, 964, 964, 965, 965], tags: ["Banking", "AA Rated"] },
    ]
  },
  gold: {
    name: "Gold",
    icon: Gem,
    color: "bg-yellow-500",
    bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    assets: [
      { id: "gold-spot", name: "Gold (Spot)", ticker: "XAU/NGN", price: "₦4,250,000/oz", change: "+₦85,000", changePercent: "+2.04%", positive: true, marketCap: "$14.5T", volume: "$180B", about: "Physical gold spot price denominated in Naira. Gold has been a store of value for thousands of years and serves as a hedge against inflation and currency depreciation.", chartData: [3900, 3950, 4000, 4020, 4050, 4080, 4100, 4120, 4150, 4180, 4220, 4250], tags: ["Precious Metal", "Safe Haven"] },
      { id: "gold-save", name: "Gold Savings Plan", ticker: "GOLD-SVP", price: "₦1,000/gram", change: "+₦20", changePercent: "+2.04%", positive: true, marketCap: "₦5B", volume: "₦350M", about: "Save in fractional gold from as little as ₦1,000. Your gold is backed by physical reserves held in secure vaults. Perfect for building a gold position over time through regular savings.", chartData: [920, 930, 940, 950, 960, 965, 970, 975, 980, 985, 995, 1000], tags: ["Savings", "Fractional"] },
    ]
  },
  "crude-oil": {
    name: "Crude Oil",
    icon: Gem,
    color: "bg-stone-700",
    bgColor: "bg-stone-700/10 dark:bg-stone-700/20",
    iconColor: "text-stone-600 dark:text-stone-400",
    assets: [
      { id: "bonny-light", name: "Bonny Light Crude", ticker: "BONNY-LT", price: "₦125,000/bbl", change: "+₦3,200", changePercent: "+2.63%", positive: true, marketCap: "N/A", volume: "$85B", about: "Nigeria's premium grade crude oil, Bonny Light, is prized for its low sulfur content and high API gravity. It commands a premium in international markets and is used as a benchmark for West African crude.", chartData: [118, 119, 120, 121, 122, 121, 123, 124, 123, 125, 124, 125], tags: ["Premium", "Nigerian"] },
      { id: "brent-crude", name: "Brent Crude", ticker: "BRENT/NGN", price: "₦120,500/bbl", change: "-₦1,500", changePercent: "-1.23%", positive: false, marketCap: "N/A", volume: "$120B", about: "Brent Crude is the international benchmark for oil pricing. It's extracted from the North Sea and serves as the primary reference price for roughly two-thirds of the world's internationally traded crude oil.", chartData: [124, 123, 122, 123, 122, 121, 122, 121, 120, 121, 120, 120], tags: ["Benchmark", "International"] },
    ]
  },
  agriculture: {
    name: "Agriculture",
    icon: Sprout,
    color: "bg-lime-600",
    bgColor: "bg-lime-600/10 dark:bg-lime-600/20",
    iconColor: "text-lime-600 dark:text-lime-400",
    assets: [
      { id: "cocoa-fund", name: "Cocoa Value Chain Fund", ticker: "COCOA-VCF", price: "₦2,800/unit", change: "+₦150", changePercent: "+5.66%", positive: true, marketCap: "₦1.2B", volume: "₦85M", about: "Invest in Nigeria's cocoa value chain from farm to export. Nigeria is the world's 4th largest cocoa producer. This fund covers cultivation, processing, and export activities.", chartData: [2400, 2450, 2500, 2520, 2550, 2600, 2620, 2650, 2700, 2720, 2760, 2800], tags: ["Export", "High Growth"] },
      { id: "rice-farm", name: "Rice Farming Fund", ticker: "RICE-FF", price: "₦1,500/unit", change: "+₦60", changePercent: "+4.17%", positive: true, marketCap: "₦650M", volume: "₦42M", about: "Fund rice farming operations across Nigeria's rice-producing states. With Nigeria's drive for rice self-sufficiency and growing demand, rice farming offers attractive seasonal returns.", chartData: [1350, 1360, 1380, 1390, 1400, 1410, 1420, 1440, 1450, 1470, 1490, 1500], tags: ["Staple Crop", "Domestic"] },
      { id: "cashew-export", name: "Cashew Export Fund", ticker: "CASHEW-EF", price: "₦3,200/unit", change: "+₦200", changePercent: "+6.67%", positive: true, marketCap: "₦480M", volume: "₦35M", about: "Nigeria is one of the top cashew producers globally. This fund invests in cashew farming, processing, and export operations, targeting premium international markets.", chartData: [2700, 2750, 2800, 2850, 2900, 2950, 2980, 3000, 3050, 3100, 3150, 3200], tags: ["Export", "Processing"] },
    ]
  },
  "club-deals": {
    name: "Club Deals",
    icon: Users,
    color: "bg-rose-500",
    bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
    iconColor: "text-rose-600 dark:text-rose-400",
    assets: [
      { id: "lekki-dev", name: "Lekki Mixed-Use Development", ticker: "CLUB-LKD", price: "₦100,000/slot", change: "+₦8,000", changePercent: "+8.70%", positive: true, marketCap: "₦3.5B", volume: "₦280M", about: "Join a syndicate of investors in a premium mixed-use development in Lekki. The project includes residential apartments, retail space, and co-working facilities in one of Lagos's fastest-growing areas.", chartData: [85, 88, 90, 92, 93, 94, 95, 96, 97, 98, 99, 100], tags: ["Real Estate", "Lagos"] },
      { id: "tech-hub", name: "Tech Hub Acquisition", ticker: "CLUB-TECH", price: "₦250,000/slot", change: "+₦15,000", changePercent: "+6.38%", positive: true, marketCap: "₦1.8B", volume: "₦150M", about: "Club deal to acquire and develop a technology hub in Yaba, Lagos. Co-working and office space leased to tech startups and established companies. Strong demand from Nigeria's growing tech ecosystem.", chartData: [210, 215, 220, 225, 228, 230, 235, 238, 240, 242, 248, 250], tags: ["Commercial", "Tech"] },
    ]
  },
  "dollar-funds": {
    name: "Dollar Funds",
    icon: DollarSign,
    color: "bg-green-600",
    bgColor: "bg-green-600/10 dark:bg-green-600/20",
    iconColor: "text-green-600 dark:text-green-400",
    assets: [
      { id: "dollar-mm", name: "Dollar Money Market Fund", ticker: "USD-MMF", price: "$1.00/unit", change: "+$0.002", changePercent: "+0.20%", positive: true, marketCap: "$120M", volume: "$15M", about: "Invest in US dollar-denominated money market instruments. Provides FX protection against naira depreciation while earning competitive dollar yields from high-quality short-term securities.", chartData: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], tags: ["Dollar", "Low Risk"] },
      { id: "eurobond", name: "Nigeria Eurobond Fund", ticker: "NG-EURO", price: "$0.95/unit", change: "+$0.008", changePercent: "+0.85%", positive: true, marketCap: "$85M", volume: "$8M", about: "Fund investing in Nigerian sovereign and corporate Eurobonds. Earn higher dollar yields from Nigeria's international debt instruments while maintaining dollar exposure.", chartData: [0.92, 0.92, 0.93, 0.93, 0.93, 0.94, 0.94, 0.94, 0.95, 0.95, 0.95, 0.95], tags: ["Dollar", "Bonds"] },
    ]
  },
  "naira-funds": {
    name: "Naira Funds",
    icon: Banknote,
    color: "bg-primary",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    assets: [
      { id: "naira-mm", name: "Naira Money Market Fund", ticker: "NGN-MMF", price: "₦100.50/unit", change: "+₦0.04", changePercent: "+0.04%", positive: true, marketCap: "₦250B", volume: "₦12B", about: "Low-risk naira money market fund investing in T-Bills, bank deposits, and high-quality commercial papers. Daily accrual of interest with same-day redemption.", chartData: [100.1, 100.15, 100.2, 100.25, 100.3, 100.32, 100.35, 100.38, 100.4, 100.42, 100.45, 100.5], tags: ["Money Market", "Daily Accrual"] },
      { id: "naira-bond-fund", name: "Naira Bond Fund", ticker: "NGN-BF", price: "₦115.20/unit", change: "+₦0.35", changePercent: "+0.30%", positive: true, marketCap: "₦80B", volume: "₦3B", about: "Professionally managed bond fund investing in FGN bonds and high-quality corporate bonds. Targets higher returns than money market funds with moderate risk.", chartData: [112, 112.5, 113, 113.3, 113.8, 114, 114.2, 114.5, 114.8, 115, 115.1, 115.2], tags: ["Bonds", "Medium-term"] },
    ]
  },
  "equity-funds": {
    name: "Equity Funds",
    icon: BarChart3,
    color: "bg-indigo-500",
    bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    assets: [
      { id: "ngx30-etf", name: "NGX 30 Index Fund", ticker: "NGX30-ETF", price: "₦450/unit", change: "+₦8.50", changePercent: "+1.93%", positive: true, marketCap: "₦15B", volume: "₦1.2B", about: "Passively managed index fund tracking the NGX 30 Index - Nigeria's top 30 companies by market capitalization. Provides instant diversification across major Nigerian stocks.", chartData: [400, 405, 410, 415, 420, 425, 428, 432, 435, 440, 445, 450], tags: ["Index", "Diversified"] },
      { id: "growth-equity", name: "Growth Equity Fund", ticker: "GROWTH-EF", price: "₦280/unit", change: "+₦12.00", changePercent: "+4.48%", positive: true, marketCap: "₦8B", volume: "₦650M", about: "Actively managed equity fund focused on high-growth Nigerian companies. The fund targets companies with strong earnings growth potential across technology, consumer goods, and financial services.", chartData: [240, 245, 248, 252, 255, 258, 260, 265, 268, 272, 276, 280], tags: ["Growth", "Active"] },
    ]
  },
  "female-led-startups": {
    name: "Female-Led Startups",
    icon: Heart,
    color: "bg-pink-500",
    bgColor: "bg-pink-500/10 dark:bg-pink-500/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    assets: [
      { id: "she-leads-fund", name: "She Leads Venture Fund", ticker: "SLV-FUND", price: "₦5,000/unit", change: "+₦250", changePercent: "+5.26%", positive: true, marketCap: "₦2B", volume: "₦120M", about: "Venture fund investing exclusively in female-founded startups across Africa. Portfolio includes companies in fintech, healthtech, agritech, and e-commerce with strong growth trajectories.", chartData: [4200, 4300, 4350, 4400, 4500, 4550, 4600, 4700, 4750, 4850, 4950, 5000], tags: ["Impact", "Venture"] },
      { id: "women-in-tech", name: "Women in Tech Fund", ticker: "WIT-FUND", price: "₦3,500/unit", change: "+₦180", changePercent: "+5.42%", positive: true, marketCap: "₦850M", volume: "₦65M", about: "Focused fund backing women-led technology companies in Nigeria and across Africa. Supports founders building solutions in payments, logistics, education, and healthcare.", chartData: [2900, 2950, 3000, 3050, 3100, 3150, 3200, 3250, 3300, 3350, 3400, 3500], tags: ["Tech", "Women-Led"] },
    ]
  },
  "angel-investing": {
    name: "Angel Investing",
    icon: Rocket,
    color: "bg-purple-600",
    bgColor: "bg-purple-600/10 dark:bg-purple-600/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    assets: [
      { id: "seed-fund", name: "Seed Stage Portfolio", ticker: "SEED-PF", price: "₦500,000/ticket", change: "+₦35,000", changePercent: "+7.53%", positive: true, marketCap: "₦5B", volume: "₦320M", about: "Curated portfolio of pre-seed and seed stage startups across Nigeria and Africa. Each deal is vetted by experienced angel investors and venture capitalists with strong track records.", chartData: [420, 430, 440, 445, 450, 455, 460, 465, 470, 480, 490, 500], tags: ["Seed Stage", "Curated"] },
      { id: "pre-series-a", name: "Pre-Series A Deals", ticker: "PRE-A", price: "₦1,000,000/ticket", change: "+₦50,000", changePercent: "+5.26%", positive: true, marketCap: "₦8B", volume: "₦450M", about: "Access pre-Series A investment opportunities in high-growth African startups. These companies have proven product-market fit and are scaling their operations.", chartData: [850, 870, 880, 900, 910, 920, 940, 950, 960, 970, 980, 1000], tags: ["Pre-Series A", "Growth"] },
    ]
  },
};

function MiniChart({ data, positive, height = 48 }: { data: number[]; positive: boolean; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 120;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "hsl(var(--chart-2))" : "hsl(0, 70%, 50%)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailChart({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 400;
  const height = 180;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 20) - 10;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const gradientId = positive ? "chartGradientGreen" : "chartGradientRed";
  const strokeColor = positive ? "hsl(var(--chart-2))" : "hsl(0, 70%, 50%)";
  const fillStart = positive ? "hsl(var(--chart-2))" : "hsl(0, 70%, 50%)";

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="rounded-lg">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillStart} stopOpacity="0.2" />
          <stop offset="100%" stopColor={fillStart} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AssetListing({ params }: { params: { category: string } }) {
  const [, setLocation] = useLocation();
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState("10,000");
  const [timeRange, setTimeRange] = useState("1M");
  const [buyStep, setBuyStep] = useState<"details" | "confirm" | "success">("details");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const category = categories[params.category];

  if (!category) {
    setLocation("/invest");
    return null;
  }

  const Icon = category.icon;

  const handleAssetTap = (asset: AssetItem) => {
    setSelectedAsset(asset);
    setInvestAmount("10,000");
    setBuyStep("details");
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setSelectedAsset(null);
    setBuyStep("details");
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/invest")}
            data-testid="button-back-invest"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-lg ${category.bgColor} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${category.iconColor}`} />
            </div>
            <span className="font-semibold">{category.name}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto px-4 lg:px-6 pt-5 lg:pt-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold mb-1" data-testid="text-category-title">{category.name}</h1>
          <p className="text-sm text-muted-foreground">{category.assets.length} assets available to invest in</p>
        </div>

        <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {category.assets.map((asset) => (
            <Card
              key={asset.id}
              className="border hover-elevate cursor-pointer"
              onClick={() => handleAssetTap(asset)}
              data-testid={`asset-card-${asset.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">{asset.ticker.slice(0, 3)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.ticker}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm" data-testid={`text-price-${asset.id}`}>{asset.price}</p>
                    <div className={`flex items-center justify-end gap-0.5 text-xs ${
                      asset.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`} data-testid={`text-change-${asset.id}`}>
                      {asset.positive ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {asset.changePercent}
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {asset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">{tag}</Badge>
                    ))}
                  </div>
                  <MiniChart data={asset.chartData} positive={asset.positive} height={36} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav currentPage="invest" />

      <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) handleCloseSheet(); else setSheetOpen(true); }}>
        <SheetContent side="bottom" className="h-[94vh] overflow-y-auto rounded-t-2xl p-0">
          {selectedAsset && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{selectedAsset.ticker.slice(0, 3)}</span>
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="text-left text-lg">{selectedAsset.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selectedAsset.ticker}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-5 space-y-5">
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <h2 className="text-3xl font-bold" data-testid="text-asset-price">{selectedAsset.price}</h2>
                  </div>
                  <div className={`flex items-center gap-1.5 text-sm ${
                    selectedAsset.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedAsset.positive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="font-medium">{selectedAsset.change}</span>
                    <span>({selectedAsset.changePercent})</span>
                  </div>
                </div>

                <div>
                  <DetailChart data={selectedAsset.chartData} positive={selectedAsset.positive} />
                  <div className="flex gap-1.5 mt-3">
                    {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((range) => (
                      <Button
                        key={range}
                        variant={timeRange === range ? "default" : "ghost"}
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => setTimeRange(range)}
                        data-testid={`button-range-${range}`}
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>

                {(selectedAsset.marketCap || selectedAsset.volume) && (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedAsset.marketCap && (
                      <Card className="border">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">Market Cap</p>
                          <p className="font-semibold text-sm">{selectedAsset.marketCap}</p>
                        </CardContent>
                      </Card>
                    )}
                    {selectedAsset.volume && (
                      <Card className="border">
                        <CardContent className="p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">24h Volume</p>
                          <p className="font-semibold text-sm">{selectedAsset.volume}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <section>
                  <h4 className="font-semibold text-sm mb-2">About {selectedAsset.name}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-asset-about">
                    {selectedAsset.about}
                  </p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {selectedAsset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="font-semibold text-sm mb-3">Investment Amount</h4>
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const num = parseInt(investAmount.replace(/,/g, ''));
                            if (num > 1000) setInvestAmount((num - 1000).toLocaleString());
                          }}
                          data-testid="button-decrease-amount"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="text-center flex-1">
                          <p className="text-2xl font-bold">₦{investAmount}</p>
                          <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-units-estimate">
                            ≈ {(parseInt(investAmount.replace(/,/g, '')) / parseFloat(selectedAsset.price.replace(/[₦,]/g, ''))).toFixed(
                              parseFloat(selectedAsset.price.replace(/[₦,]/g, '')) > 10000 ? 6 : 2
                            )} units
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const num = parseInt(investAmount.replace(/,/g, ''));
                            setInvestAmount((num + 1000).toLocaleString());
                          }}
                          data-testid="button-increase-amount"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {["5,000", "10,000", "50,000"].map((amt) => (
                          <Button
                            key={amt}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => { setInvestAmount(amt); setShowCustomInput(false); }}
                            data-testid={`button-amount-${amt}`}
                          >
                            ₦{amt}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => setShowCustomInput(!showCustomInput)}
                          data-testid="button-amount-custom"
                        >
                          Custom
                        </Button>
                      </div>
                      {showCustomInput && (
                        <div className="flex gap-2 mt-3 items-center">
                          <span className="text-sm font-medium">₦</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              setCustomAmount(raw);
                              if (raw && parseInt(raw) > 0) {
                                setInvestAmount(parseInt(raw).toLocaleString());
                              }
                            }}
                            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            data-testid="input-custom-amount"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>

                <section>
                  <h4 className="font-semibold text-sm mb-3">Key Information</h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">SEC Regulated</p>
                        <p className="text-xs text-muted-foreground">Fully compliant with Nigerian regulations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Auto-Invest</p>
                        <p className="text-xs text-muted-foreground">Set up recurring investments</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Info className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Real-time Tracking</p>
                        <p className="text-xs text-muted-foreground">Monitor performance live</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {buyStep === "details" && (
                <div className="p-5 pt-3 space-y-2 border-t bg-background">
                  <Button className="w-full" size="lg" onClick={() => setBuyStep("confirm")} data-testid="button-buy-asset">
                    <Wallet className="w-5 h-5 mr-2" />
                    Buy ₦{investAmount} of {selectedAsset.ticker}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By investing, you agree to the terms and conditions
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedAsset && buyStep === "confirm" && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-5 pb-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setBuyStep("details")} data-testid="button-confirm-back">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <SheetTitle className="text-left">Confirm Purchase</SheetTitle>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 pt-2 space-y-5">
                <div className="text-center py-4">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white text-lg font-bold">{selectedAsset.ticker.slice(0, 3)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">You are buying</p>
                  <p className="text-3xl font-bold mb-1">₦{investAmount}</p>
                  <p className="text-sm text-muted-foreground">of {selectedAsset.name} ({selectedAsset.ticker})</p>
                </div>

                <Card className="border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Asset</span>
                      <span className="text-sm font-medium" data-testid="text-confirm-asset">{selectedAsset.name}</span>
                    </div>
                    <div className="border-t" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Price</span>
                      <span className="text-sm font-medium" data-testid="text-confirm-price">{selectedAsset.price}</span>
                    </div>
                    <div className="border-t" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="text-sm font-medium" data-testid="text-confirm-amount">₦{investAmount}</span>
                    </div>
                    <div className="border-t" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Est. Units</span>
                      <span className="text-sm font-medium" data-testid="text-confirm-units">
                        {(parseInt(investAmount.replace(/,/g, '')) / parseFloat(selectedAsset.price.replace(/[₦,]/g, ''))).toFixed(
                          parseFloat(selectedAsset.price.replace(/[₦,]/g, '')) > 10000 ? 6 : 2
                        )}
                      </span>
                    </div>
                    <div className="border-t" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Transaction Fee</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">Free</span>
                    </div>
                    <div className="border-t" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Payment Method</span>
                      <span className="text-sm font-medium">Wallet Balance</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-primary/5">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your investment is protected under Nigerian SEC regulations. You can sell your holdings at any time during market hours.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="p-5 pt-3 space-y-2 border-t bg-background">
                <Button className="w-full" size="lg" onClick={() => setBuyStep("success")} data-testid="button-confirm-purchase">
                  Confirm Purchase
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setBuyStep("details")} data-testid="button-cancel-purchase">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {selectedAsset && buyStep === "success" && (
            <div className="flex flex-col h-full items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <PartyPopper className="w-8 h-8 text-yellow-500 mb-3" />
              <h2 className="text-2xl font-bold mb-2" data-testid="text-success-title">Purchase Successful!</h2>
              <p className="text-muted-foreground mb-1">You just invested</p>
              <p className="text-3xl font-bold mb-1" data-testid="text-success-amount">₦{investAmount}</p>
              <p className="text-muted-foreground mb-6">in {selectedAsset.name} ({selectedAsset.ticker})</p>

              <Card className="border w-full max-w-xs mb-6">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Purchase Price</span>
                    <span className="text-xs font-medium">{selectedAsset.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Amount Invested</span>
                    <span className="text-xs font-medium">₦{investAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Completed</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="w-full max-w-xs space-y-2">
                <Button className="w-full" size="lg" onClick={() => { setBuyStep("details"); }} data-testid="button-buy-more">
                  Buy More {selectedAsset.ticker}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleCloseSheet} data-testid="button-back-to-assets">
                  Back to {category.name}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
