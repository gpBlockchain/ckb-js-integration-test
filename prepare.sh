git clone https://github.com/ckb-js/lumos.git
cd lumos
git checkout ckb2023
cd ../
git clone https://github.com/gpBlockchain/ckb-rpc-mock-data.git
cd ckb-rpc-mock-data
git checkout v0.111.0
pip install -r requirements.txt
pip install Werkzeug
python3 api/index.py > index.log 2>&1 &
