from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from apps.core.models import CompanyInfo, Feature, HeroSlide, Statistic
from apps.gallery.models import GalleryCategory, GalleryItem
from apps.products.models import Category, Product
from apps.research.models import ResearchArticle, ResearchCategory
from apps.services.models import Service

# A 1x1 transparent GIF, used as a lightweight placeholder image for seeded content.
PLACEHOLDER_GIF = (
    b"GIF87a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00,"
    b"\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
)


def placeholder(name):
    return ContentFile(PLACEHOLDER_GIF, name=name.replace(".png", ".gif"))


class Command(BaseCommand):
    help = "Populates the database with realistic Karppal sample content (safe to re-run)."

    def handle(self, *args, **options):
        self._seed_company_info()
        self._seed_homepage()
        self._seed_products()
        self._seed_services()
        self._seed_gallery()
        self._seed_research()
        self.stdout.write(self.style.SUCCESS("Demo data seeded."))

    def _seed_company_info(self):
        info = CompanyInfo.load()
        info.name = "Karppal"
        info.tagline = "Agricultural and Animal Products Processing Company"
        info.description = (
            "In Afghanistan, we work in agriculture, horticulture, and food products "
            "to improve quality and promote sustainable production."
        )
        info.mission = (
            "Our mission is to use modern technologies and a professional team to provide "
            "effective and sustainable solutions for our customers."
        )
        info.vision = (
            "We believe that trust, transparency, and commitment are the most important "
            "values of successful cooperation."
        )
        info.email = "info@karppal.af"
        info.phone = "+93 780 194 632"
        info.address = "Afghanistan, Kabul, Industrial Parks"
        info.founded_year = 2011
        info.save()

    def _seed_homepage(self):
        if not HeroSlide.objects.exists():
            HeroSlide.objects.create(
                title="Karppal Agro-Animal Production", subtitle="Quality dairy, naturally produced",
                image=placeholder("hero-1.png"), cta_text="Show All Products", cta_link="/all", order=1,
            )

        stats = [
            ("bi-trophy", "15+", "Years Experience"),
            ("bi-box-seam", "25+", "Type Of Production"),
            ("bi-building-gear", "2.000+", "Capacity Of Production (Ton)"),
            ("bi-people", "200+", "Specialist Employee"),
            ("bi-globe", "15+", "Countries For Exportation"),
            ("bi-emoji-smile", "5.000+", "Satisfied Customers"),
        ]
        for i, (icon, value, label) in enumerate(stats, start=1):
            Statistic.objects.get_or_create(label=label, defaults={"icon": icon, "value": value, "order": i})

        features = [
            ("bi-building-gear", "Standard Production", "We have given the first place to advanced technologies for production."),
            ("bi-patch-check", "Quality Control", "We conduct our tests in all parts of the process and production."),
            ("bi-flower1", "Natural Products", "We produce our products without adding any harmful substances or contaminants."),
            ("bi-truck", "Fast Delivery", "We provide 24-hour support for all our services."),
            ("bi-globe2", "Global Export", "We offer our export services worldwide."),
            ("bi-headset", "24/7 Support", "Our team is available 24 hours a day, 7 days a week."),
        ]
        for i, (icon, title, text) in enumerate(features, start=1):
            Feature.objects.get_or_create(title=title, defaults={"icon": icon, "text": text, "order": i})

    def _seed_products(self):
        category, _ = Category.objects.get_or_create(name="Dairy Products", defaults={"order": 1})
        products = [
            ("Milk", "Fresh pasteurized milk, produced daily.", "milk.png"),
            ("Butter (Maska)", "Traditional churned butter made from fresh cream.", "butter.png"),
            ("Yogurt", "Natural, thick, additive-free yogurt.", "yogurt.png"),
            ("Chaka (Strained Yogurt)", "Dripped, protein-rich strained yogurt.", "chaka.png"),
            ("Cheese", "Handmade traditional cheese.", "cheese.png"),
        ]
        for i, (name, desc, filename) in enumerate(products, start=1):
            if not Product.objects.filter(name=name).exists():
                Product.objects.create(
                    category=category, name=name, short_description=desc, description=desc,
                    image=placeholder(filename), featured=True, order=i,
                )

    def _seed_services(self):
        services = [
            ("💼", "Business Consulting", "Analyzing your needs and designing suitable strategies for long-term growth."),
            ("🌐", "Web Design & Development", "Building modern platforms with excellent user experience."),
            ("📱", "Application Development", "Mobile and web applications to grow customer engagement."),
            ("📈", "Digital Marketing", "Targeted advertising and campaign optimization."),
            ("🛠️", "Technical Support", "Continuous support and technical problem solving."),
            ("✨", "AI & Automation", "Intelligent tools to automate processes and reduce costs."),
        ]
        for i, (icon, name, desc) in enumerate(services, start=1):
            Service.objects.get_or_create(name=name, defaults={"icon": icon, "short_description": desc, "order": i, "featured": i <= 3})

    def _seed_gallery(self):
        category, _ = GalleryCategory.objects.get_or_create(name="Production Facility", defaults={"order": 1})
        for i in range(1, 4):
            title = f"Facility Photo {i}"
            if not GalleryItem.objects.filter(title=title).exists():
                GalleryItem.objects.create(category=category, title=title, image=placeholder(f"gallery-{i}.png"), order=i)

    def _seed_research(self):
        category, _ = ResearchCategory.objects.get_or_create(name="Research & Development", defaults={"order": 1})
        title = "Karppal launches new digital services initiative"
        if not ResearchArticle.objects.filter(title=title).exists():
            ResearchArticle.objects.create(
                category=category, title=title,
                excerpt="Karppal focuses on innovation, customer satisfaction, and sustainability.",
                content="Karppal is expanding its digital and production capabilities to serve customers faster and more reliably.",
                featured_image=placeholder("research-1.png"), featured=True,
            )
