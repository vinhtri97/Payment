import React from 'react';
import { StripeProvider } from 'react-stripe-elements';
import { Elements } from 'react-stripe-elements';
import { injectStripe, CardNumberElement, CardExpiryElement, CardCVCElement } from 'react-stripe-elements';

//defines image icons
import visaIcon from './img/visaImage.png'
class _CheckoutFrom extends React.Component {
  state = {
    isMessageDisplay: false,
    isPurchaseSucess: false,
    width: 0,
    height: 0,
  }
  onFormSubmit = (e) => {
    e.preventDefault();
    console.log('charged');
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then(async (payload) => {
          console.log(payload);
          try {
            const res = await fetch(
              "http://192.168.10.119:5000/api/payment/charge",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload.token)
              }
            )
            if (res.status === 200) {
              this.setState({
                isMessageDisplay: true,
                isPurchaseSucess: true
              });
            }
            else {
              this.setState({
                isMessageDisplay: true,
                isPurchaseSucess: false
              });
            }
          }
          catch (err) {
            this.setState({
              isMessageDisplay: true,
              isPurchaseSucess: false
            });
          }

        });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }

  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  getStyle = (name, key) => {
    const { width } = this.state;
    switch (name) {
      case 'labelStyle':
        return ({
          color: '#E4E9EF',
          fontFamily: 'Source Code Pro, monospace',
          fontSize: width > 600 ? '23px' : '18px',
          margin: 0
        })
      case 'cardInformationStyle':
        return ({
          base: {
            fontSize: width > 600 ? '22px' : '18px',
            color: "#32325d",
            fontFamily: 'Source Code Pro, monospace',
            '::placeholder': { "color": '#aab7c4' },
          }
        })
      case 'cardElementContainerStyle':
        switch (key) {
          case 'cardNumber':
            return ({
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: width > 600 ? '14px' : '8px',
              width: width > 600 ? '470px' : '280px'
            })
          case 'expDate':
            return ({
              padding: width > 600 ? '14px' : '8px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              width: width > 600 ? '210px' : '160px',
            })
          case 'cvc':
            return ({
              padding: width > 600 ? '14px' : '8px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              width: width > 600 ? '100px' : '80px',
            })
          default: return null;
        }
      case 'formElementContainerStyle':
        {
          return ({
            marginTop: key !== 'cardNumber' ? width > 600 ? '40px' : '5px' : 0,
            marginLeft: key === 'cvc' && (width > 600 ? '40px' : '20px'),
          })
        }
      default: return null;
    }
  }

  render() {
    return <div style={{ display: 'block', width: '90%', margin: 'auto', marginTop: '6vh' }} >
      <div className='d-block w-100' style={{ backgroundColor: '#566582', border: '2px', borderRadius: '1vh 1vh 1vh 1vh' }}>
        <img src={visaIcon} alt='visa-icon' style={{ width: '17vw', height: '5vh', marginLeft: '65vw', marginTop: '2vh' }} />
        <form onSubmit={this.onFormSubmit}>
          <div style={{ padding: '0vh 5vw 4vh 5vw', }}>
            <div style={this.getStyle('formElementContainerStyle', 'cardNumber')}>
              <label htmlFor='cardNumberElement' style={this.getStyle('labelStyle')}>Card Number</label>
              <div style={this.getStyle('cardElementContainerStyle', 'cardNumber')}>
                <CardNumberElement
                  id='cardNumberElement'
                  style={this.getStyle('cardInformationStyle')}
                />
              </div>
            </div>

            <div className='d-inline-block' style={this.getStyle('formElementContainerStyle')}>
              <label htmlFor='cardExpiryElement' style={this.getStyle('labelStyle')}>Expiration Date</label>
              <div style={this.getStyle('cardElementContainerStyle', 'expDate')}>
                <CardExpiryElement
                  id='cardExpiryElement'
                  style={this.getStyle('cardInformationStyle')}
                />
              </div>
            </div>

            <div className='d-inline-block' style={this.getStyle('formElementContainerStyle', 'cvc')}>
              <label htmlFor='cardCVCElement' style={this.getStyle('labelStyle')}>CVC</label>
              <div style={this.getStyle('cardElementContainerStyle', 'cvc')}>
                <CardCVCElement
                  id='cardCVCElement'
                  style={this.getStyle('cardInformationStyle')}
                />
              </div>
            </div>
          </div>
          <div style={{ position: 'fixed', marginTop: '3vh', width: '90%', textAlign: 'center', backgroundColor: '#E4E9EF' }}>
            <button type='submit' className='btn btn-info' style={{ width: '50vw', height: '8vh', fontSize: '3vh', border: '1px', borderRadius: '3vh', backgroundColor: '#566582', marginTop: '2vh' }}>Pay</button>
            {this.state.isMessageDisplay && (this.state.isPurchaseSucess ?
              <p className='text-success'>Purchase Successfully</p> :
              <p className='text-danger'>Purchase Failed. Please try again</p>)}
          </div>
        </form>

      </div>


    </ div >
  }
}

const CheckoutFrom = injectStripe(_CheckoutFrom);

function App() {
  return (
    <StripeProvider apiKey="pk_test_yzBmHjbSUMj0ijYyKNjUJec6">
      <Elements>
        <CheckoutFrom />
      </Elements>
    </StripeProvider>
  );
}

export default App;
