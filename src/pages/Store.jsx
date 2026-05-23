import { useState } from "react";
import Header from "../components/layout/Header";
import SectionTitle from "../components/layout/SectionTitle";

import shortsImg from "../assets/shorts.png";
import socksImg from "../assets/socks.png";
import gunImg from "../assets/massage_gun.png";
import matImg from "../assets/yoga_mat.png";
import shakerImg from "../assets/shaker.png";
import compShortsImg from "../assets/compression_shorts.png";
import tshirt1Img from "../assets/tshirt_white_orange.png";
import sweatpantsImg from "../assets/sweatpants.png";
import tshirt2Img from "../assets/tshirt_performance.png";
import leggingsImg from "../assets/leggings.png";
import beltImg from "../assets/belt.png";
import bagImg from "../assets/gym_bag.png";
import rollerImg from "../assets/foam_roller.png";
import bandsImg from "../assets/bands.png";
import glovesImg from "../assets/gloves.png";
import bandsV2Img from "../assets/bands_v2.png";
import waterImg from "../assets/water.png";
import kitBeltGlovesImg from "../assets/kit_belt_gloves.png";
import medicineImg from "../assets/medicine.png";
import energyDrinkImg from "../assets/energy_drink.png";
import suppElectrolytesImg from "../assets/supp_electrolytes.png";
import suppPumpImg from "../assets/supp_pump.png";
import suppWheyImg from "../assets/supp_whey.png";

const products = [
  // ROUPAS
  { id: 1, name: "Bermuda AlphaFit Pro", price: "R$ 89,90", category: "Roupas", image: shortsImg, specs: "Tecido dry-fit, bolsos com zíper." },
  { id: 2, name: "Meia Compressão AlphaFit", price: "R$ 49,90", category: "Roupas", image: socksImg, specs: "Melhora a circulação, fio poliamida." },
  { id: 6, name: "Bermuda Térmica AlphaFit", price: "R$ 79,90", category: "Roupas", image: compShortsImg, specs: "Compressão média, secagem rápida." },
  { id: 7, name: "Camiseta DryFit Alpha", price: "R$ 69,90", category: "Roupas", image: tshirt1Img, specs: "Tecido respirável para treinos intensos." },
  { id: 8, name: "Calça Jogger AlphaFit", price: "R$ 149,90", category: "Roupas", image: sweatpantsImg, specs: "Conforto máximo com listra lateral." },
  { id: 9, name: "Camiseta Performance", price: "R$ 89,90", category: "Roupas", image: tshirt2Img, specs: "Design ergonômico, proteção UV." },
  { id: 10, name: "Legging Cós Alto Alpha", price: "R$ 119,90", category: "Roupas", image: leggingsImg, specs: "Zero transparência, efeito modelador." },

  // EQUIPAMENTOS
  { id: 3, name: "AlphaGun Recovery", price: "R$ 249,90", category: "Equipamentos", image: gunImg, specs: "6 velocidades, 4 ponteiras." },
  { id: 4, name: "AlphaMat Antiderrapante", price: "R$ 129,90", category: "Equipamentos", image: matImg, specs: "Material TPE ecológico, 6mm." },
  { id: 11, name: "Cinturão de Musculação", price: "R$ 159,90", category: "Equipamentos", image: beltImg, specs: "Couro legítimo, suporte lombar extremo." },
  { id: 12, name: "Mala AlphaFit Duffle", price: "R$ 219,90", category: "Equipamentos", image: bagImg, specs: "Impermeável, com bolso para tênis." },
  { id: 13, name: "Rolo de Liberação", price: "R$ 99,90", category: "Equipamentos", image: rollerImg, specs: "EVA de alta densidade, texturizado." },
  { id: 14, name: "Kit Faixas Elásticas", price: "R$ 69,90", category: "Equipamentos", image: bandsImg, specs: "3 tensões diferentes, tecido elástico." },
  { id: 15, name: "Luva de Treino Alpha", price: "R$ 59,90", category: "Equipamentos", image: glovesImg, specs: "Palma acolchoada, grip antiderrapante." },
  { id: 16, name: "Mini Bands Pro", price: "R$ 79,90", category: "Equipamentos", image: bandsV2Img, specs: "Látex super resistente e durável." },
  { id: 18, name: "Kit Força Alpha (Cinturão+Luva)", price: "R$ 199,90", category: "Equipamentos", image: kitBeltGlovesImg, specs: "Combo essencial para carga máxima." },

  // ÁGUA
  { id: 5, name: "Coqueteleira Premium", price: "R$ 59,90", category: "Água", image: shakerImg, specs: "Livre de BPA, compartimento whey, 700ml." },
  { id: 17, name: "Garrafas Squeeze Alpha", price: "R$ 49,90", category: "Água", image: waterImg, specs: "Térmica, livre de BPA, bico esportivo." },

  // REMÉDIOS
  { id: 19, name: "Alpha Relax & Relief", price: "R$ 54,90", category: "Remédios", image: medicineImg, specs: "Analgésico e pomada relaxante muscular." },

  // ENERGÉTICOS
  { id: 20, name: "AlphaFit Boost Energy", price: "R$ 14,90", category: "Energéticos", image: energyDrinkImg, specs: "Zero açúcar, com taurina e cafeína." },

  // SUPLEMENTOS
  { id: 21, name: "Kit Eletrólitos AlphaFit", price: "R$ 69,90", category: "Suplementos", image: suppElectrolytesImg, specs: "Reposição rápida de minerais, 15 sachês." },
  { id: 22, name: "Pump Pre-Workout", price: "R$ 159,90", category: "Suplementos", image: suppPumpImg, specs: "Explosão de energia, pote 300g." },
  { id: 23, name: "Whey Isolate Combo", price: "R$ 249,90", category: "Suplementos", image: suppWheyImg, specs: "Combo completo: proteína pura + foco." },
];

const categories = ["Todos", "Roupas", "Equipamentos", "Suplementos", "Água", "Energéticos", "Remédios"];

export default function Store() {
  const [activeTab, setActiveTab] = useState("Todos");

  const filteredProducts = activeTab === "Todos" 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <div className="app-bg h-screen flex flex-col overflow-y-auto">
      <Header />
      <div className="flex-grow container py-6 flex flex-col">
        <SectionTitle
          badge="AlphaStore"
          title="Nossa Loja"
          subtitle="Roupas e equipamentos oficiais para o seu treino render mais."
        />
        
        {/* Tabs de Categorias */}
        <div className="flex flex-wrap gap-2 mb-6 mt-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                activeTab === cat 
                  ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]" 
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="glass card flex gap-4 p-4 hover:border-orange-500/50 transition-colors cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-orange-500/5 z-0"></div>
                
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/50 border border-white/5 relative z-10 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/150/111111/ff6b00?text=Imagem";
                    }}
                  />
                </div>
                
                <div className="flex flex-col justify-between relative z-10 flex-grow">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-orange-500 font-bold mb-1 block">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mb-1 leading-tight">{product.name}</h3>
                    <p className="text-xs text-white/50 leading-tight">{product.specs}</p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-lg font-black text-white">{product.price}</span>
                    <button className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30 group-hover:bg-orange-500 text-orange-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(255,107,0,0.2)]">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-white/50 bg-black/20 rounded-2xl border border-white/5">
              <span className="text-4xl block mb-2">📦</span>
              Nenhum produto cadastrado nesta categoria ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
