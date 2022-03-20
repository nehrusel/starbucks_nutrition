import { StatusBar } from 'expo-status-bar';
import { SearchBar, Icon } from 'react-native-elements';
import React, { PureComponent, useState } from 'react';
import ModalSelector from 'react-native-modal-selector'
import raw_drinks from './all_drinks';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View
} from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';

const drinks = raw_drinks.map((d, i) => {
  d.id = i; d.searchText = `${d.name} ${d.size} ${d.milk}`.toLowerCase(); return d;
})

function FindUnique(list) {
  const s = [];
  list.forEach(item => { if (s.indexOf(item) === -1) s.push(item) });
  return s;
}

const kAllCategories = "All Drinks";
const UniqueCategories = [kAllCategories].concat(FindUnique(drinks.map(d => d.category)));
const kAllSizes = "All Sizes";
const UniqueSizes = [kAllSizes].concat(FindUnique(drinks.map(d => d.size)));
const kAllMilks = "Any Milk";
const UniqueMilks = [kAllMilks].concat(FindUnique(drinks.map(d => d.milk)));
const kNoSort = "Unsorted";
const kSortByCalories = "Calories ↓";
const kSortBySugar = "Sugar ↓";
const kSortByCarbs = "Carbs ↓";
const kSortByProtein = "Protein ↓";
const kSortByFat = "Fat ↓";
const kSortByCaffeine = "Caffeine ↓";
const kSortByCaloriesDesc = "Calories ↑";
const kSortBySugarDesc = "Sugar ↑";
const kSortByCarbsDesc = "Carbs ↑";
const kSortByProteinDesc = "Protein ↑";
const kSortByFatDesc = "Fat ↑";
const kSortByCaffeineDesc = "Caffeine ↑";
const UniqueSorts = [kNoSort, kSortByCalories, kSortBySugar, kSortByFat, kSortByCarbs, kSortByProtein, kSortByCaffeine, kSortByCaloriesDesc, kSortBySugarDesc, kSortByFatDesc, kSortByCarbsDesc, kSortByProteinDesc, kSortByCaffeineDesc];

const NutritionContent = ({ name, value, unit }) => {
  return <View style={{ flex: 1, flexDirection: 'column', width: '10%', alignItems: 'center' }}>
    <Text style={{ color: 'white' }}>{ Math.round(value, 2) } <Text style={{ fontSize: 12 }}>{unit}</Text></Text>
    <Text style={{ color: 'lightgreen', fontSize: 12 }}>{name}</Text>
  </View>
}


const TitleWithHighlightedSearchTerm = ({ title, term }) => {
  if (!term || term.length < 3 || title.toLowerCase().indexOf(term) === -1) {
    return <Text style={{ color: 'white', fontSize: 20 }}>{title}</Text>;
  }
  const idx = title.toLowerCase().indexOf(term);
  const pre = title.substring(0, idx);
  const during = title.substring(idx, idx + term.length);
  const post = title.substring(idx + term.length);

  return <Text>
    <Text style={{ color: 'white', fontSize: 20  }}>{pre}</Text>
    <Text style={{ color: '#362415', fontSize: 20,  backgroundColor: '#EAC784' }}>{during}</Text>
    <Text style={{ color: 'white', fontSize: 20 }}>{post}</Text>
  </Text>;
}

const OptionPicker = ({ data, initVal, onChange, value }) => {
  const manyItems = data.length > 10;
  return <View><ModalSelector
    data={data}
    keyExtractor={(item, idx) => item}
    labelExtractor={(item) => item}
    style={{ justifyContent: 'center' }}
    initValue={initVal}
    animationType='fade'
    overlayStyle={{ backgroundColor: '#00704A' }}
    backdropPressToClose
    cancelContainerStyle={{ display: 'none' }}
    optionContainerStyle={{ backgroundColor: '#00704A', borderWidth: 0, borderColor: 'lightgrey', paddingLeft: manyItems ? 30 : 0, paddingRight: manyItems ? 30 : 0, paddingBottom: manyItems ? 60 : 0, paddingTop: manyItems ? 50 : 0 }}
    optionStyle={{ padding: '4.5%', borderBottomColor: '#EAC784', borderBottomWidth: 1 }}
    optionTextStyle={{ fontSize: manyItems ? 18 : 20, color: 'white' }}
    onChange={onChange}>
    <Text style={{ color: value == initVal ? 'lightgrey' : '#EAC784' }}>{`      ${value}      `}</Text>
  </ModalSelector>
  </View>;

}



class ItemSeparatorView extends PureComponent {
  render() {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: 'white',
        }}
      />
    );
  }
};

class ItemView extends PureComponent {
  render() {
    const { setActiveAddons, activeAddons, search, setPinnedDrink } = this.props;
    const item = this.props.item.item;

    return (
      // Flat List Item
      <View style={{ padding: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1, flexDirection: 'row', paddingBottom: 3 }}>
          <Text style={{ color: '#EAC784', paddingRight: 15 }}>{item.category}</Text>
          <Text style={{ color: 'lightgrey', paddingRight: 15 }}>{item.size}</Text>
          <Text style={{ color: 'lightgrey', paddingRight: 15 }}>{item.servingSize}</Text>
          <Text style={{ color: 'lightgrey', paddingRight: 15 }}>{item.milk + ' Milk'}</Text>
          <Text style={{ color: 'lightgrey', paddingRight: 15 }}>{item.whip ? 'Whip' : 'No Whip'}</Text>
          {item.category != "Add-Ons" && activeAddons.length > 0 && <Text style={{ color: 'gold', fontSize: 11 }}>+ {activeAddons.length}</Text>}
        </ScrollView>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <View width="90%"><TitleWithHighlightedSearchTerm term={search} title={item.name} /></View>

          {!item.pinned && item.category == "Add-Ons" && <View width="10%">
            <TouchableHighlight underlayColor={null}
              onPress={() => setActiveAddons(activeAddons.concat(item.id))}
            >
              <Text style={{ textAlign: 'center', paddingBottom: '0.5%' }}> <Icon color="#EAC784" name="add-circle" /></Text>
            </TouchableHighlight>
          </View>}

          {!item.pinned && item.category != "Add-Ons" && <View width="15%">
            <TouchableHighlight underlayColor={null}
              onPress={() => setPinnedDrink(item.id)}
            >
              <Icon color="#EAC784" name="push-pin" />
            </TouchableHighlight>
          </View>}

          {item.pinned && <View width="15%">
            <TouchableHighlight underlayColor={null}
              onPress={() => setPinnedDrink(undefined)}
            >
              <Text style={{ textAlign: 'center', paddingBottom: '0.5%' }}><Icon color="#EAC784" name="remove-circle" /></Text>
            </TouchableHighlight>
          </View>}


        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop: '3%', paddingBottom: '3%' }}>
          <NutritionContent name="Cals" value={item.calories} unit="" />
          <NutritionContent name="Fat" value={item.fat} unit="" />
          <NutritionContent name="Carbs" value={item.carbs} unit="" />
          <NutritionContent name="Sugar" value={item.sugar} unit="" />
          <NutritionContent name="Protein" value={item.protein} unit="" />
          <NutritionContent name="Caffeine" value={item.caffeine} unit="mg" />
        </View>
      </View>
    );
  }
};

export default function App() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState(kAllCategories);
  const [filterSize, setFilterSize] = useState(kAllSizes);
  const [filterMilk, setFilterMilk] = useState(kAllMilks);
  const [sort, setSort] = useState(kNoSort);
  const [activeAddons, setActiveAddons] = useState([]);
  const [pinnedDrink, setPinnedDrink] = useState(undefined);


  const DoFilter = () => {
    const nutritionFromAddons = [0, 0, 0, 0, 0, 0];
    activeAddons.forEach(a => {
      const addon = raw_drinks[a];
      nutritionFromAddons[0] += addon.calories;
      nutritionFromAddons[1] += addon.fat;
      nutritionFromAddons[2] += addon.carbs;
      nutritionFromAddons[3] += addon.sugar;
      nutritionFromAddons[4] += addon.protein;
      nutritionFromAddons[5] += addon.caffeine;
    });

    let pinnedDrinkWithAddons = undefined;
    if (pinnedDrink != undefined) {
      pinnedDrinkWithAddons = { ...raw_drinks[pinnedDrink] };
      pinnedDrinkWithAddons.pinned = true;
      pinnedDrinkWithAddons.calories += nutritionFromAddons[0];
      pinnedDrinkWithAddons.fat += nutritionFromAddons[1];
      pinnedDrinkWithAddons.carbs += nutritionFromAddons[2];
      pinnedDrinkWithAddons.sugar += nutritionFromAddons[3];
      pinnedDrinkWithAddons.protein += nutritionFromAddons[4];
      pinnedDrinkWithAddons.caffeine += nutritionFromAddons[5];
    }

    let results = drinks;
    if (filterCategory != kAllCategories || filterSize != kAllSizes || filterMilk != kAllMilks) {
      results = results.filter(d => {
        let keep = true;
        if (filterCategory != kAllCategories) { keep = d.category == filterCategory; }
        if (filterSize != kAllSizes && keep) { keep = d.size == filterSize; }
        if (filterMilk != kAllMilks && keep) { keep = d.milk == filterMilk; }
        return keep;
      });
    }
    if (search && search.length > 2) {
      results = results.filter(d => {
        if (!search || search.length < 3) { return true; }
        return d.searchText.includes(search);
      });
    };

    results.map(_d => {
      if (_d.category == "Add-Ons") { return _d; }
      let d = { ..._d };
      d.calories += nutritionFromAddons[0];
      d.fat += nutritionFromAddons[1];
      d.carbs += nutritionFromAddons[2];
      d.sugar += nutritionFromAddons[3];
      d.protein += nutritionFromAddons[4];
      d.caffeine += nutritionFromAddons[5];
      return d;
    });
    if (sort != kNoSort) {
      results = results.sort((a, b) => {
        switch (sort) {
          case kSortByCalories:
            return a.calories > b.calories;
          case kSortBySugar:
            return a.sugar > b.sugar;
          case kSortByCarbs:
            return a.carbs > b.carbs;
          case kSortByFat:
            return a.fat > b.fat;
          case kSortByProtein:
            return a.protein > b.protein;
          case kSortByCaffeine:
            return a.caffeine > b.caffeine;
          case kSortByCaloriesDesc:
            return a.calories < b.calories;
          case kSortBySugarDesc:
            return a.sugar < b.sugar;
          case kSortByCarbsDesc:
            return a.carbs < b.carbs;
          case kSortByFatDesc:
            return a.fat < b.fat;
          case kSortByProteinDesc:
            return a.protein < b.protein;
          case kSortByCaffeineDesc:
            return a.caffeine < b.caffeine;
        }
      })
    }
    return { list: results, pin: pinnedDrinkWithAddons };
  }

  const filteredResults = DoFilter();
  const numItems = filteredResults.list.length;
  const placeholder = numItems < 5 ? 'Search' : `Search ${numItems > 1000 ? '1000+' : numItems} items`;


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: '100%', paddingTop: '7%' }}>
        <SearchBar
          round
          containerStyle={{ backgroundColor: '#00704A', borderTopColor: '#00704A', borderBottomColor: '#00704A', padding: '4%' }}
          lightTheme
          searchIcon={{ size: 24 }}
          onChangeText={(text) => { setSearch(text.toLowerCase()); }}
          onClear={() => { setSearch(''); }}
          placeholder={placeholder}
          value={search}
        />

      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        <OptionPicker
          data={UniqueCategories}
          initVal={kAllCategories}
          onChange={setFilterCategory}
          value={filterCategory} />

        <OptionPicker
          data={UniqueSizes}
          initVal={kAllSizes}
          onChange={setFilterSize}
          value={filterSize} />

        <OptionPicker
          data={UniqueMilks}
          initVal={kAllMilks}
          onChange={setFilterMilk}
          value={filterMilk} />

        <OptionPicker
          data={UniqueSorts}
          initVal={kNoSort}
          onChange={setSort}
          value={sort} />

      </ScrollView>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal

      >
        <TouchableHighlight underlayColor={null} onPress={() => { if (filterCategory == "Add-Ons") return; setFilterCategory("Add-Ons"); setSearch(''); setFilterSize(kAllSizes); setFilterMilk(kAllMilks); }}><Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
          {activeAddons.length === 0 ? `        No Add-Ons Selected` : `        Selected Add-Ons`}
        </Text></TouchableHighlight>

        {activeAddons.reverse().map((a, i) => (
          <View key={`addon-top-${i}`}>
            <TouchableHighlight underlayColor={null} onPress={() => {
              let found = false;
              setActiveAddons(
                activeAddons.filter(e => { if (e == a && !found) { found = true; return false; } return true; }));
            }}>
              <Text style={{ color: 'wheat', fontSize: 11 }}>
                {`     ${raw_drinks[a].name} (${raw_drinks[a].size})   `}
              </Text>
            </TouchableHighlight>
          </View>))}
      </ScrollView>


      <View style={{ display: filteredResults.pin == undefined ? 'none' : 'flex', width: '99%', height: pinnedDrink == undefined ? '5%' : '18%', borderTopWidth: 2, borderTopColor: '#EAC784' }}>
        {filteredResults.pin != undefined ?
          <FlatList
            scrollEnabled={false}
            data={[filteredResults.pin]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => <ItemView item={item} search="" setPinnedDrink={setPinnedDrink} setActiveAddons={setActiveAddons} activeAddons={activeAddons} />} /> : <Text></Text>}
      </View>

      <View style={{ width: '99%', height: pinnedDrink == undefined ? '77%' : '60%', borderTopWidth: 2, borderTopColor: '#EAC784' }}>
        <FlatList
          initialNumToRender={15}
          data={filteredResults.list}
          updateCellsBatchingPeriod={200}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <ItemSeparatorView />}
          renderItem={(item) => <ItemView item={item} search={search} setPinnedDrink={setPinnedDrink} setActiveAddons={setActiveAddons} activeAddons={activeAddons} />} />
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00704A',
    color: '#EAC784',
  }
});
