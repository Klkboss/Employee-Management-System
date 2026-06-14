from setuptools import setup, find_packages

requires = [
    'pyramid',
    'sqlalchemy',
    'waitress',
    'pymysql',
    'passlib',
    'pyjwt',
    'cryptography',
    'zope.sqlalchemy',
]

setup(
    name='employee_api',
    version='0.1',
    packages=find_packages(),
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = employee_api:main'
        ],
    },
)
