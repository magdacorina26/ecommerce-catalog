# bdsa-product-catalog

# git clone

```bash
git clone https://github.com/magdacorina26/ecommerce-catalog.git
```

```bash
cd ecommerce-catalog
```

```$xslt
Go to server.js and setup these variables:
DATABASE_NAME
DATABASE_TYPE
DATABASE_HOST
DATABASE_USER
DATABASE_PASS
EMAIL_USERNAME
EMAIL_PASSWORD
```

```bash
npm install
```

# install mysql

```bash
mysql-ctl start
```

```bash
mysql -u root
```

```sql
source ~/workspace/bdsa-product-catalog/sql/catalog.sql
```

```sql
INSERT INTO categories (name, description) VALUES ('Carti','Cele mai tari carti');
```

```sql
INSERT INTO products (name, description, category_id, price) VALUES ('Clean Code', 'Make code great again!', 1, 100);
```

```sql
exit
```
