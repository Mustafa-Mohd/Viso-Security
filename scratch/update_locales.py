import json
import os

locales = {
    'en.json': {
        "locations": {
            "title": "OUR LOCATION",
            "subtitle": "Serving Saudi Arabia and Surroundings",
            "nationwide": "Saudi Arabia (Nationwide)",
            "cities": {
                "riyadh": { "name": "Riyadh", "region": "Central Region" },
                "jeddah": { "name": "Jeddah", "region": "Western Region" },
                "makkah": { "name": "Makkah", "region": "Western Region" },
                "madina": { "name": "Madina", "region": "Western Region" },
                "dammam": { "name": "Dammam", "region": "Eastern Region" },
                "jubail": { "name": "Jubail", "region": "Industrial City" },
                "yanbu": { "name": "Yanbu", "region": "Industrial City" },
                "neom": { "name": "NEOM Region", "region": "Northwest" },
                "taif": { "name": "Taif", "region": "Western Highlands" },
                "tabuk": { "name": "Tabuk", "region": "Northern Region" }
            }
        }
    },
    'ar.json': {
        "locations": {
            "title": "موقعنا",
            "subtitle": "نخدم المملكة العربية السعودية وما حولها",
            "nationwide": "المملكة العربية السعودية (على مستوى البلاد)",
            "cities": {
                "riyadh": { "name": "الرياض", "region": "المنطقة الوسطى" },
                "jeddah": { "name": "جدة", "region": "المنطقة الغربية" },
                "makkah": { "name": "مكة المكرمة", "region": "المنطقة الغربية" },
                "madina": { "name": "المدينة المنورة", "region": "المنطقة الغربية" },
                "dammam": { "name": "الدمام", "region": "المنطقة الشرقية" },
                "jubail": { "name": "الجبيل", "region": "المدينة الصناعية" },
                "yanbu": { "name": "ينبع", "region": "المدينة الصناعية" },
                "neom": { "name": "منطقة نيوم", "region": "الشمال الغربي" },
                "taif": { "name": "الطائف", "region": "المرتفعات الغربية" },
                "tabuk": { "name": "تبوك", "region": "المنطقة الشمالية" }
            }
        }
    },
    'ur.json': {
        "locations": {
            "title": "ہمارا مقام",
            "subtitle": "سعودی عرب اور گردونواح کی خدمت میں",
            "nationwide": "سعودی عرب (ملک بھر میں)",
            "cities": {
                "riyadh": { "name": "ریاض", "region": "وسطی علاقہ" },
                "jeddah": { "name": "جدہ", "region": "مغربی علاقہ" },
                "makkah": { "name": "مکہ", "region": "مغربی علاقہ" },
                "madina": { "name": "مدینہ", "region": "مغربی علاقہ" },
                "dammam": { "name": "دمام", "region": "مشرقی علاقہ" },
                "jubail": { "name": "جبیل", "region": "صنعتی شہر" },
                "yanbu": { "name": "ینبع", "region": "صنعتی شہر" },
                "neom": { "name": "نیوم کا علاقہ", "region": "شمال مغرب" },
                "taif": { "name": "طائف", "region": "مغربی پہاڑی علاقے" },
                "tabuk": { "name": "تبوک", "region": "شمالی علاقہ" }
            }
        }
    }
}

for filename, data_to_add in locales.items():
    filepath = os.path.join(r"c:\Users\staff\Downloads\viso\src\locales", filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data.update(data_to_add)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
