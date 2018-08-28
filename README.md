# A simple seo validator
A simple SEO validator with some rules built in.

# Rules
- TagsWithoutAttribute
- TagsNotInHead
- TagsMoreThan
# Pre-defined SEO rules
1. Detect if any <img /> tag without alt attribute
2. Detect if any <a /> tag without rel attribute
3. In <head> tag
i. Detect if header doesn’t have <title> tag
ii. Detect if header doesn’t have <meta name=“descriptions” ... /> tag
iii. Detect if header doesn’t have <meta name=“keywords” ... /> tag
4. Detect if there’re more than 15 <strong> tag in HTML (15 is a value should be configurable by user)
5. Detect if a HTML have more than one <H1> tag.