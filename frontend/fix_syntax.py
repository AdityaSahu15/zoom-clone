import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the broken Customer Stories section
broken_section_pattern = re.compile(r'\{\/\* CUSTOMER STORIES \*\/\}.*?\{\/\* NEWS SECTION \*\/\}', re.DOTALL)

fixed_section = """{/* CUSTOMER STORIES */}
      <section className="bg-white py-[200px]">
        <div className="max-w-[1440px] mx-auto px-[24px]">
          <h2 className="text-[40px] font-[800] text-[#111111] mb-[40px] text-center md:text-center">Powering modern teams</h2>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-[100px]">
            {/* Featured Case Study */}
            <div className="h-[380px] rounded-[20px] overflow-hidden relative group cursor-pointer border border-[#e7e9ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
               <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Customer" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050b1f] via-[#050b1f]/60 to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-end text-center items-center">
                 <h3 className="text-white text-[28px] font-[800] leading-[36px] mb-4">"Zoom has unified our global workforce, increasing collaboration efficiency by 45%."</h3>
                 <span className="text-white/80 font-[500] text-[14px] flex items-center gap-2 hover:text-white transition-colors cursor-pointer w-max">Read Case Study <ChevronRight className="w-4 h-4" /></span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS SECTION */}"""

content = re.sub(broken_section_pattern, fixed_section, content)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
