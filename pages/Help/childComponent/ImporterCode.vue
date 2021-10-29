<template>
  <div>
    <scroll-view class="scrollViewHeight">
    <modal-paragraph :isSpace="true" content="According to SARS Customs regulations (SC-CF-19 2.1) if you import more than 3 times a year, and/or the value of the of transactions exceeds R50,000 you need to obtain an importer's code. If you do not meet these requirements we are still liable to furnish SARS with your ID number in order to obtain clearance."/>
    <modal-paragraph :isSpace="true" content="As from 9 August 2018 we will need every consignee to provide us with their South African Importer's Code OR South African ID number to finalise the clearance. "/>
    <modal-paragraph :isSpace="true" content="As a supplier, once you have placed an order, we will inform you immediately as to whether the consignee needs an importers code or identity number in the event that the information is not on file. We will also undertake to contact the consignee to obtain this information in order to complete the clearance procedures and ensure that we keep a record of these details for future transactions. In respect of consignees who only provide ID numbers, the system will only clear orders three times per year provided the total value does not exceed R50,000 per year."/>
    <modal-paragraph :isSpace="true" content="Here are the steps to apply Importer's Code："/>
    <modal-paragraph :isSpace="true" content="1)Get bank statement for proof of bank account (auto bank statement is fine)."/>
    <modal-paragraph :isSpace="true" content="2)Make a copy of your ID."/>
    <modal-paragraph :isSpace="true" content="3)Get proof of residence (water and lights statement)."/>
    <modal-paragraph :isSpace="true" content="4)Get proof of your cell phone or land line number (statement or write an affidavit as proof)."/>
    <modal-paragraph :isSpace="true" content="5)Write an application letter stating that you want to apply for an importers code."/>
    <modal-paragraph :isSpace="true" content="     6)Get your ID, Proof of residence, cell phone number (statement or Affidavit) and application letter certified at the police station."/>
    <modal-paragraph :isSpace="true" content="     7)Get a printout from a S.A.R.S revenue office of your income tax number."/>
    <modal-paragraph :isSpace="true" content="     8)Go to the customs offices with all your documentation."/>
    <modal-paragraph :isSpace="true" content="     We will supply you with the DA185 and DA185.4A1 forms for customs."/>
    <modal-paragraph :isSpace="true" content="     Make Sure that your certifications are clear and everything is readable. If it is not you will be declined or asked to go back to the police station do have your documents recertified."/>
    <modal-paragraph :isSpace="true" content="     Normally will take 10 working days. Please apply the Importer's Code in time, otherwise it may affect the aging."/>
    <div class="help-detail-parage">
      <span>Customs required form download：</span>
      <a target="_blank" href="http://www.buffaloex.com/pdf/LAPD-LSec-CE-RA-2013-08%20-%20Notice%20R291%20GG%2036372%20Form%20DA%20185%2019%20April%202013.pdf"><span>LAPD-LSec-CE-RA.PDF</span></a>
      <a target="_blank" href="http://www.buffaloex.com/pdf/DA%20185%204A1%20-%20Registration%20for%20Importer%20-%20External%20Form.pdf"><span>DA 185 4A1.PDF</span></a>
    </div>
    <modal-title title="SSS beginner guidance："/>
    <modal-paragraph content="

										Thank you for choosing ShopShipShake, we will take you into a brand new purchase platform! If you are curious of SSS and want to know what it is and how it works, please click this link and get the information of SSS. We believe you cannot help to register after reading our beginner’s guidance!
										"/>
    <div class="help-detail-img">
      <img src="~assets/images/help/beginner.jpg" alt="">
    </div>
    </scroll-view>
  </div>
</template>

<script>
import ModalTitle from "./Modal/ModalTitle";
import ModalParagraph from "./Modal/ModalParagraph";
import ScrollView from "@/components/common/ScrollView";
export default {
  name: "ImporterCode",
  props:['title'],
  components:{ ModalTitle ,ModalParagraph ,ScrollView}
}
</script>

<style scoped lang="less">
@import "~assets/less/help.less";
a{
  background:rgb(255, 255, 0);
  color:#333
}
.scrollViewHeight{
  height:calc(100vh - 50px - 50px)
}
</style>
