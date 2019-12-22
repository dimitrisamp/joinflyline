<template>
  <div class="membership-guest">
    <div class="membership-guest__right">
      <h3 class="membership-guest__heading">Welcome Back Zach!</h3>
      <p class="membership-guest__text">
        You've used your free booking, now it's time to pick a plan
      </p>
      <div class="membership-guest__plan">
        <div class="membership-guest__plan-left">
          <h4>FlyLine Basic</h4>
          <h4 class="membership-guest__price">$39.99<span>/yr</span></h4>
          <router-link to="/" class="button button-outline--blue"
            >Select</router-link
          >
        </div>
        <div class="membership-guest__plan-right">
          <ul>
            <li>- Flight Search & book</li>
            <li>- Lorem ipsum dolor sit amet.</li>
            <li>- Lorem ipsum dolor sit amet, consectetur.</li>
            <li>- Lorem ipsum.</li>
          </ul>
        </div>
      </div>
      <div class="membership-guest__plan">
        <div class="membership-guest__plan-left">
          <h4>FlyLine Basic</h4>
          <h4 class="membership-guest__price">$39.99<span>/yr</span></h4>
          <router-link to="/" class="button button-outline--blue"
            >Select</router-link
          >
        </div>
        <div class="membership-guest__plan-right">
          <ul>
            <li>- Flight Search & book</li>
            <li>- Lorem ipsum dolor sit amet.</li>
            <li>- Lorem ipsum dolor sit amet, consectetur.</li>
            <li>- Lorem ipsum.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="membership-guest__left">
      <h3 class="membership-guest__heading">Payment</h3>
      <p class="membership-guest__text membership-guest__text--large">
        Enter your payment info and you're all set
      </p>
      <div class="membership-guest__form">
        <form action="">
          <p>FlyLines Basic - $39.99/yr</p>
          <hr />
          <input
            type="text"
            class="form-control"
            placeholder="Credit Card Number"
          />
          <input type="text" class="form-control" placeholder="Billing Zip" />
          <div class="form-container">
            <input type="text" class="form-control" placeholder="Exp Date" />
            <input type="text" class="form-control" placeholder="CCV" />
          </div>
          <label class="control control--checkbox">
            <span>Agree FlyLine Terms of Use and Privacy Policy</span>
            <input type="checkbox" checked="checked" />
            <div class="control__indicator"></div>
          </label>
          <router-link to="/" class="button button--big button-outline--blue"
            >Buy FlyLine Basic - $39.99</router-link
          >
        </form>
      </div>
    </div>
  </div>
</template>
<script></script>
>
